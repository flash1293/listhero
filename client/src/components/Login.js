import React, { Component } from "react";
import AppBar from "material-ui/AppBar";
import RaisedButton from "material-ui/RaisedButton";
import { connect } from "react-redux";
import TextField from "material-ui/TextField";
import CircularProgress from "material-ui/CircularProgress";
import { Redirect } from "react-router";

export class Login extends Component {
  state = {
    passwordText: ""
  };
  onChangeText = (_, value) => {
    this.setState({
      passwordText: value
    });
  };
  onLogin = e => {
    e.preventDefault();
    this.props.onLogin(this.state.passwordText);
  };
  render() {
    if (this.props.loggedIn) {
      return <Redirect to="/" />;
    } else
      return (
        <div>
          <AppBar title="Login" showMenuIconButton={false} />
          <form onSubmit={this.onLogin} style={{ margin: "10px" }}>
            <TextField
              fullWidth
              autoFocus
              value={this.state.passwordText}
              onChange={this.onChangeText}
              hintText="Passwort"
              type="password"
              errorText={this.props.failed ? "Zugriff fehlgeschlagen" : ""}
            />
            <RaisedButton
              label="Login"
              disabled={this.props.requesting}
              primary={true}
              onClick={this.onLogin}
              icon={
                this.props.requesting ? (
                  <CircularProgress size={25} thickness={2} />
                ) : (
                  undefined
                )
              }
            />
          </form>
        </div>
      );
  }
}

export const ConnectedLogin = connect(
  (state, ownProps) => ({
    ...state.user
  }),
  (dispatch, ownProps) => ({
    onLogin: password => {
      dispatch({
        type: "LOGIN",
        password
      });
      dispatch({
        type: "@@sync/REQUEST_SYNC",
        key: "lists",
        skipRetry: true
      });
    }
  })
)(Login);
