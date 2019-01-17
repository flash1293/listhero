import React from "react";
import ActionHistory from "@material-ui/icons/History";
import { Link } from "react-router-dom";
import Fab from "@material-ui/core/Fab";

import ListIcon from "./ListIcon";

export default ({ currentList, lastList }) =>
  <React.Fragment>
    {currentList.hasRecentItems && <Link
      style={{ position: "fixed", right: 15, bottom: 15 }}
      to={`/lists/${currentList.uid}/entries/last-used`}
    >
      <Fab color="primary" aria-label="recently used">
        <ActionHistory />
      </Fab>
    </Link>}
    {lastList && lastList.hasLeadingEmoji && <Link
      style={{ position: "fixed", left: 15, bottom: 15 }}
      to={`/lists/${lastList.uid}/entries${
        lastList.preferredView === "edit" ? "/edit" : ""
      }`}
    >
      <Fab color="primary" aria-label="add">
        <ListIcon name={lastList.name} style={{
          width: 21,
          display: "inline-block",
          marginTop: 3
        }} />
      </Fab>
    </Link>}
  </React.Fragment>;