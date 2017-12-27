import { withHandlers, withState } from "recompose";
import compose from "ramda/src/compose";

export default handlerProp =>
  compose(
    withState("isDialogOpen", "setDialogOpen", false),
    withHandlers({
      handleDialogClose: ({ setDialogOpen }) => () => setDialogOpen(false),
      handleDialogOpen: ({ setDialogOpen }) => () => setDialogOpen(true),
      handleDialogSubmit: ({ setDialogOpen, ...ownProps }) => dialogData => {
        ownProps[handlerProp](dialogData);
        setDialogOpen(false);
      }
    })
  );
