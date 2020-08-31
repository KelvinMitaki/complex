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
  render() {
    return <div></div>;
  }
}

export default Fib;
