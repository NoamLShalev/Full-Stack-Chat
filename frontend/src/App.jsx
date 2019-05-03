import React, { Component } from "react";
import { connect } from "react-redux";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import ChatMessages from "./ChatMessages.jsx";
import ChatForm from "./ChatForm.jsx";

class UnconnectedApp extends Component {
  componentDidMount = () => {
    fetch("http://138.197.131.216/login-check", {
      credentials: "include"
    })
      .then(responseHeader => {
        console.log("im here");
        return responseHeader.text();
      })
      .then(responseBody => {
        console.log("now im here", responseBody);
        let parsed = JSON.parse(responseBody);
        if (parsed.success) {
          this.props.dispatch({ type: "login-success" });
          this.props.dispatch({ type: "loaded" });
        }
        this.props.dispatch({ type: "loaded" });
      });
  };

  render = () => {
    if (this.props.loading) {
      return <div>Loading...</div>;
    }
    if (this.props.logged) {
      return (
        <div className="list-container">
          <div className="users">
            <p>Active Users:</p>
            <ul>
              {this.props.users.map(user => {
                return <li>{user}</li>;
              })}
            </ul>
          </div>
          <div>
            <ChatMessages />
            <ChatForm />
          </div>
        </div>
      );
    }
    return (
      <div>
        <h1>Signup: </h1>
        <Signup />
        <h1>Login: </h1>
        <Login />
      </div>
    );
  };
}

let mapStateToProps = st => {
  return {
    logged: st.loggedIn,
    loading: st.loading,
    users: st.users
  };
};

let App = connect(mapStateToProps)(UnconnectedApp);

export default App;
