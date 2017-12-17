import React from "react";
import { Redirect } from "react-router";
import { branch } from "recompose";
import prop from "ramda/src/prop";
import not from "ramda/src/not";
import compose from "ramda/src/compose";

export default branch(compose(not, prop("uid"), prop("list")), () => () => (
  <Redirect to="/" />
));
