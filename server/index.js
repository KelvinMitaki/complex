const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER
});

pgClient.on("error", () => console.log("lost client connection"));
pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch(err => console.log(err));
