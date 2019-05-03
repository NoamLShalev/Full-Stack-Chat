import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedChatMessages extends Component {
  componentDidMount = () => {
    let updater = () => {
      fetch("http://138.197.131.216:4000/messages", {
        credentials: "include"
      })
        .then(header => {
          return header.text();
        })
        .then(responseBody => {
          let parsed = JSON.parse(responseBody);
          if (!parsed.success) {
            alert("You are not logged in!");
            this.props.dispatch({ type: "login-failure" });
            return;
          }
          this.props.dispatch({
            type: "set-messages",
            messages: parsed.messages,
            users: parsed.actives
          });
        });
    };
    this.interval = setInterval(updater, 500);
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  render = () => {
    return (
      <div>
        <ul>
          {this.props.messages.map(object => {
            if (object.image === undefined) {
              return (
                <li>
                  <span className="time">{object.time}</span>
                  {object.username + object.message}
                </li>
              );
            }
            return (
              <li>
                <span className="time">{object.time}</span>
                {object.username + object.message}
                <img src={object.image} height="100px" />
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
}

let mapStateToProps = st => {
  return {
    messages: st.msgs
  };
};

let ChatMessages = connect(mapStateToProps)(UnconnectedChatMessages);

export default ChatMessages;
