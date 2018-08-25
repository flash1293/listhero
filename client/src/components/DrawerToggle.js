import { withHandlers, withState } from "recompose";
import compose from "ramda/src/compose";

export default compose(
  withState("isDrawerOpen", "setDrawerOpen", false),
  withHandlers({
    toggleDrawer: ({ isDrawerOpen, setDrawerOpen }) => () =>
      setDrawerOpen(!isDrawerOpen)
  })
);