import React, { Component } from "react";
import axios from "axios";

export class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: ""
  };
  async componentDidMount() {
    const res = await axios.get("/api/values/current");
    this.setState({ values: res.data });
    const res2 = await axios.get("/api/values/all");
    this.setState({ seenIndexes: res2.data });
  }
  handleSubmit = async e => {
    e.preventDefault();
    await axios.post("/api/values", { index: this.state.index });
    this.setState({ index: "" });
  };
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index</label>
          <input
            type="text"
            onChange={e => this.setState({ index: e.target.value })}
            value={this.state.index}
          />
          <button
            disabled={
              this.state.index === "" ||
              (this.state.index && this.state.index.trim() === "")
            }
            type="submit"
          >
            Submit
          </button>
        </form>
        <h3>INDEXES I HAVE SEEN:</h3>
        {this.state.seenIndexes.length !== 0 &&
          this.state.seenIndexes.map(({ number }) => number).join(", ")}
        <h3>CALCULATED VALUES</h3>
        {Object.keys(this.state.values).length !== 0 &&
          Object.keys(this.state.values).map(key => {
            return (
              <div key={key}>
                for index {key}, I calculated{" "}
                {parseInt(this.state.values[key]).toLocaleString()}
              </div>
            );
          })}
      </div>
    );
  }
}

export default Fib;
