import React, { Component } from "react";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import { connect } from "react-redux";
import TextField from "material-ui/TextField";
import { CircularProgress } from "material-ui/Progress";
import { Redirect } from "react-router";

export class Login extends Component {
  state = {
    passwordText: ""
  };
  onChangeText = e => {
    this.setState({
      passwordText: e.target.value
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
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography type="title" color="inherit">
                Login
              </Typography>
            </Toolbar>
          </AppBar>
          <form onSubmit={this.onLogin} style={{ margin: "10px" }}>
            <TextField
              fullWidth
              autoFocus
              value={this.state.passwordText}
              onChange={this.onChangeText}
              placeholder="Passwort"
              type="password"
              label={this.props.failed ? "Zugriff fehlgeschlagen" : ""}
              error={this.props.failed}
            />
            <Button
              raised
              style={{ marginTop: "10px", position: "relative" }}
              disabled={this.props.requesting}
              color="primary"
              type="submit"
              onClick={this.onLogin}
            >
              Login
              {this.props.requesting && (
                <CircularProgress
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: -11,
                    marginLeft: -11
                  }}
                  size={25}
                  thickness={4}
                />
              )}
            </Button>
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
