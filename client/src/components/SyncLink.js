import { withProps } from "recompose";
import compose from "ramda/src/compose";
import { connect } from "react-redux";
import aes from "aes-js";

import buildSelector, { user } from "../redux/selectors";

export default compose(
  connect(buildSelector({ user })),
  withProps(
    ({ user: { username, password, encryptionKey, serverPassword } }) => {
      const { origin, pathname } = window.location;
      let url = `${origin}${pathname}#/`;

      if (username) {
        url += `login/${username}/${password}/${aes.utils.hex.fromBytes(
          encryptionKey
        )}/${serverPassword}`;
      }
      return {
        syncLink: url
      };
    }
  )
);
