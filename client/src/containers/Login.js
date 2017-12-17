import React from "react";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import { connect } from "react-redux";
import TextField from "material-ui/TextField";
import { CircularProgress } from "material-ui/Progress";
import { Redirect } from "react-router";
import { branch } from "recompose";
import { compose } from "redux";

import buildHandlers, { requestLogin } from "../redux/actions";
import buildSelector, { user } from "../redux/selectors";
import inputForm from "../components/InputForm";

const Login = ({
  text,
  handleChangeText,
  handleSubmit,
  requesting,
  failed
}) => (
  <div>
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography type="title" color="inherit">
          Login
        </Typography>
      </Toolbar>
    </AppBar>
    <form onSubmit={handleSubmit} style={{ margin: "10px" }}>
      <TextField
        fullWidth
        autoFocus
        value={text !== undefined ? text : ""}
        onChange={handleChangeText}
        placeholder="Passwort"
        type="password"
        label={failed ? "Zugriff fehlgeschlagen" : ""}
        error={failed}
      />
      <Button
        raised
        style={{ marginTop: "10px", position: "relative" }}
        disabled={requesting}
        color="primary"
        type="submit"
        onClick={handleSubmit}
      >
        Login
        {requesting && (
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

export default compose(
  connect(
    buildSelector({ user }),
    buildHandlers({
      onSubmit: requestLogin
    })
  ),
  branch(
    props => props.user.loggedIn,
    () => () => <Redirect to="/" />,
    inputForm
  )
)(Login);
