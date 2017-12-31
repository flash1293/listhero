import { withProps } from "recompose";
import compose from "ramda/src/compose";
import { connect } from "react-redux";

import buildSelector, { user } from "../redux/selectors";
import { arrayToBase64String } from "../redux/utils";

export default compose(
  connect(buildSelector({ user })),
  withProps(({ user: { username, password, encryptionKey } }) => {
    const { origin, pathname } = window.location;
    let url = `${origin}${pathname}#/`;

    if (username) {
      url += `login/${username}/${password}/${arrayToBase64String(
        encryptionKey
      )}`;
    }
    return {
      syncLink: url
    };
  })
);
