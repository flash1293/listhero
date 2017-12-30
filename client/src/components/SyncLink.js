import { withProps } from "recompose";
import compose from "ramda/src/compose";
import { connect } from "react-redux";

import buildSelector, { user } from "../redux/selectors";

export default compose(
  connect(buildSelector({ user })),
  withProps(({ user: { username, password } }) => {
    const { origin, pathname } = window.location;
    const url = `${origin}${pathname}#/login/${username}/${password}`;
    return {
      syncLink: url
    };
  })
);
