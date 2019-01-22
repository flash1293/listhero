export const abortableActionMiddleware = ({ dispatch }) => next => {
  const activeActions = new Map();

  return action => {
    switch (action.type) {
      case "ENQUEUE_ABORTABLE_ACTION":
        activeActions.set(
          action.action,
          action.delay
            ? setTimeout(() => {
                activeActions.delete(action.action);
                dispatch(action.action);
              }, action.delay)
            : 0
        );
        break;
      case "COMMIT_ABORTABLE_ACTION":
        if (activeActions.has(action.action)) dispatch(action.action);
        // falls through
      case "CANCEL_ABORTABLE_ACTION":
        const runningTimeout = activeActions.get(action.action);
        if (runningTimeout) clearTimeout(runningTimeout);
        activeActions.delete(action.action);
        break;
      default:
        break;
    }
    return next(action);
  };
};

export const createAbortableAction = (action, delay = 1000) => ({
  type: "ENQUEUE_ABORTABLE_ACTION",
  action,
  delay
});

export const cancelAbortableAction = action => ({
  type: "CANCEL_ABORTABLE_ACTION",
  action
});

export const commitAbortableAction = action => ({
  type: "COMMIT_ABORTABLE_ACTION",
  action
});

export const abortableActionReducer = (state = {}, action) => {
  function removeAction(state, action) {
    if (
      state[action.type] &&
      state[action.type].length > 0 &&
      state[action.type].includes(action)
    ) {
      return {
        ...state,
        [action.type]:
          state[action.type] &&
          state[action.type].filter(currentAction => currentAction !== action)
      };
    } else {
      return state;
    }
  }

  switch (action.type) {
    case "ENQUEUE_ABORTABLE_ACTION":
      return {
        ...state,
        [action.action.type]: [
          ...(state[action.action.type] || []),
          action.action
        ]
      };
    case "CANCEL_ABORTABLE_ACTION":
      return removeAction(state, action.action);
    default:
      return removeAction(state, action);
  }
};
