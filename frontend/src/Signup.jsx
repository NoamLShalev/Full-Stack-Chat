import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleUsernameChange = event => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    fetch("http://138.197.131.216:4000/signup", {
      method: "POST",
      body: data,
      credentials: "include"
    })
      .then(header => {
        return header.text();
      })
      .then(responseBody => {
        let parsed = JSON.parse(responseBody);
        if (!parsed.success) {
          alert("Username already taken!");
          return;
        }
        this.props.dispatch({ type: "login-success" });
      });
    this.setState({ username: "", password: "" });
  };

  render = () => {
    return (
      <form onSubmit={this.handleSubmit}>
        Username:
        <input
          type="text"
          onChange={this.handleUsernameChange}
          value={this.state.username}
        />
        Password:
        <input
          type="text"
          onChange={this.handlePasswordChange}
          value={this.state.password}
        />
        <input type="submit" value="Signup" />
      </form>
    );
  };
}

let Signup = connect()(UnconnectedSignup);

export default Signup;
