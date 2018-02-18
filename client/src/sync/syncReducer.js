export default (reducer, key) => {
  // Call the reducer with empty action to populate the initial state
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    merged: true,
    sequence: 0
  };

  // Return a reducer that handles undo and redo
  return function(state = initialState, action) {
    const { past, present, sequence } = state;

    switch (action.type) {
      case "@@sync/MERGE":
        if (action.key !== key) return state;
        const startingState = action.undo === 0 ? present : past[0];
        // the new past state (the sync-point) is the old sync-point plus the
        // actions returned from the server (local log not included)
        const newPastState = action.replayLog
          .slice(0, action.replayLog.length - action.localLogLength)
          .reduce(reducer, startingState);
        // the new current state is the new sync-point plus the
        // local only changes
        const newState = action.replayLog
          .slice(action.replayLog.length - action.localLogLength)
          .reduce(reducer, newPastState);
        return {
          ...state,
          // forget all pasts but the the state with the new actions form the server
          // the current local present is not completely synced yet
          past: [newPastState],
          present: newState,
          merged: true,
          sequence: sequence - action.undo + action.replayLog.length
        };
      case "@@sync/SYNC":
        if (action.key !== key) return state;
        return {
          ...state,
          // forget the oldest past because this state is now synced. If all states are synced,
          // declare the current present the new sync-point
          past: past.length === 1 ? [present] : past.slice(1),
          merged: true
        };
      case "@@sync/PURGE":
        if (action.key !== key) return state;
        return initialState;
      case "@@sync/START_SYNC":
        if (action.key !== key) return state;
        return {
          ...state,
          merged: false,
          // remember past if sync starts (because we may have to revert to this position in the next sync)
          past: [...past, present]
        };
      default:
        // Delegate handling the action to the passed reducer
        const newPresent = reducer(present, action);
        if (present === newPresent) {
          return state;
        }
        return {
          // remember initial past if there is none (happens when freshly synced)
          past: past.length === 0 ? [present] : past,
          present: newPresent,
          merged: false,
          sequence: sequence + 1
        };
    }
  };
};
