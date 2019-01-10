import React from "react";
import ActionHistory from "@material-ui/icons/History";
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/Fab";

export default ({ uid }) => (
  <React.Fragment>
    <Link
      style={{ position: "fixed", right: 15, bottom: 15 }}
      to={`/lists/${uid}/entries/last-used`}
    >
      <Fab color="primary" aria-label="add">
        <ActionHistory />
      </Fab>
    </Link>
  </React.Fragment>
);
