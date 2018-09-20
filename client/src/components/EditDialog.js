import { withHandlers, withState, mapProps } from "recompose";
import compose from "ramda/src/compose";

export default (objectName, handlerProp, dialogNamePrefix = "") =>
  compose(
    withState("dialogObject", "setDialogObject", null),
    withHandlers({
      [`handleDialog${dialogNamePrefix}Close`]: ({ setDialogObject }) => () => setDialogObject(null),
      [`handleDialog${dialogNamePrefix}Open`]: ({ setDialogObject }) => dialogObject =>
        setDialogObject(dialogObject),
      [`handleDialog${dialogNamePrefix}Submit`]: ({
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
