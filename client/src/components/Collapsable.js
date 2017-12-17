import { withReducer } from "recompose";

export default withReducer(
  "open",
  "toggle",
  (open, toToggle) => ({
    ...open,
    [toToggle]: !open[toToggle]
  }),
  {}
);
