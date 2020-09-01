const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const redis = require("redis");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER
});

pgClient.on("error", () => console.log("lost client connection"));
pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch(err => console.log(err));

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();
app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");
  res.send(values.rows);
});

app.get("/values/current", (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const { index } = req.body;
  if (parseInt(index) > 40) {
    return res.status(422).send("index too high");
  }
  await redisClient.hset("values", index, "Nothing yet!");
  await redisPublisher.publish("insert", index);
  await pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);
  res.send({ working: true });
});

const sub = redisClient.duplicate();

const fib = index => {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
};

sub.on("message", (channel, message) => {
  redisClient.hset("values", message, fib(parseInt(message)));
});

sub.subscribe("insert");
app.listen(5000, err =>
  err ? console.log(err) : console.log(`server started on port 5000`)
);
