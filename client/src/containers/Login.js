import React from "react";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import { connect } from "react-redux";
import TextField from "material-ui/TextField";
import { CircularProgress } from "material-ui/Progress";
import { Redirect } from "react-router";
import { branch, lifecycle } from "recompose";
import { compose } from "redux";

import buildHandlers, { requestLogin, createLogin } from "../redux/actions";
import buildSelector, { user } from "../redux/selectors";

const Login = () => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography type="title" color="inherit">
          Login
        </Typography>
      </Toolbar>
    </AppBar>
    {/* TODO make pretty */}
    <CircularProgress size={50} thickness={10} />
  </div>
);

export default compose(
  connect(
    buildSelector({ user }),
    buildHandlers({
      requestLogin,
      createLogin
    })
  ),
  branch(props => props.user.loggedIn, () => () => <Redirect to="/" />),
  lifecycle({
    componentDidMount() {
      const { user, requestLogin, createLogin } = this.props;
      if (user.username) {
        requestLogin(user.username, user.password);
      } else {
        createLogin();
      }
    }
  })
)(Login);
