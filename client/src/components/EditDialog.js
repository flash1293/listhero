import { withHandlers, withState, mapProps } from "recompose";
import compose from "ramda/src/compose";

export default (objectName, handlerProp) =>
  compose(
    withState("dialogObject", "setDialogObject", null),
    withHandlers({
      handleDialogClose: ({ setDialogObject }) => () => setDialogObject(null),
      handleDialogOpen: ({ setDialogObject }) => dialogObject =>
        setDialogObject(dialogObject),
      handleDialogSubmit: ({
        setDialogObject,
        dialogObject,
        ...ownProps
      }) => dialogData => {
        ownProps[handlerProp](dialogObject, dialogData);
        setDialogObject(null);
      }
    }),
    mapProps(({ dialogObject, setDialogObject, ...ownProps }) => ({
      ...ownProps,
      [`dialog${objectName}`]: dialogObject
    }))
  );
