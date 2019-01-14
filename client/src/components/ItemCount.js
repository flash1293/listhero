import React from "react";
import Typography from "@material-ui/core/Typography";

export default ({ count: itemCount }) =>
  itemCount >= 10 && (
    <Typography
      variant="button"
      style={{ display: "inline-block", color: "white" }}
    >
      ({itemCount})
    </Typography>
  );
