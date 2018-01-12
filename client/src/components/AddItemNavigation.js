import React from "react";
import ActionHistory from "material-ui-icons/History";
import { Link } from "react-router-dom";
import Button from "material-ui/Button";

export default ({ uid }) => (
  <React.Fragment>
    <Link
      style={{ position: "fixed", right: 15, bottom: 15 }}
      to={`/lists/${uid}/entries/last-used`}
    >
      <Button fab color="primary" aria-label="add">
        <ActionHistory />
      </Button>
    </Link>
  </React.Fragment>
);
