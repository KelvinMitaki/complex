import React, { Component } from "react";
import { Link } from "react-router-dom";

export class OtherPage extends Component {
  render() {
    return (
      <div>
        <Link to="/">Go back to home</Link>
      </div>
    );
  }
}

export default OtherPage;
