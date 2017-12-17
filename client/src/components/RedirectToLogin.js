import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { branch } from "recompose";
import prop from "ramda/src/prop";
import { compose } from "redux";

export default compose(
  connect(state => ({
    loggedOut: !state.user.loggedIn
  })),
  branch(prop("loggedOut"), () => () => <Redirect to="/login" />)
);
