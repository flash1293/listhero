import { withState, withHandlers } from "recompose";
import compose from "ramda/src/compose";

import "./RemoveAnimation.css";

export default clickHandlerProp =>
  compose(
    withState("hideClassName", "setHideClassName", ""),
    withHandlers({
      onRemoveDelayed: ownProps => e => {
        e.stopPropagation();
        ownProps.setHideClassName("ekofe-leave");
        setTimeout(
          () => ownProps.setHideClassName("ekofe-leave ekofe-leave-active"),
          0
        );
        setTimeout(ownProps[clickHandlerProp], 500);
      }
    })
  );
