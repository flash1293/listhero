export default (reducer, key) => {
    // Call the reducer with empty action to populate the initial state
    const initialState = {
      past: [],
      present: reducer(undefined, {}),
      merged: true,
      sequence: 0
    }
  
    // Return a reducer that handles undo and redo
    return function (state = initialState, action) {
      const { past, present, sequence } = state;
  
      switch (action.type) {
        case '@@sync/MERGE':
          if (action.key !== key) return state;
          const startingState = (action.undo === 0 ? present : past[past.length - action.undo]);
          const newState = action.replayLog.reduce(reducer, startingState);
          return {
            ...state,
            past: [],
            present: newState,
            merged: true,
            sequence: sequence - action.undo + action.replayLog.length
          }
        case '@@sync/SYNC':
          if (action.key !== key) return state;
          return {
              ...state,
              past: [],
              merged: true
          };
        case '@@sync/PURGE':
          if (action.key !== key) return state;
          return initialState;
        default:
          // Delegate handling the action to the passed reducer
          const newPresent = reducer(present, action);
          if (present === newPresent) {
            return state
          }
          return {
            past: [...past, present],
            present: newPresent,
            merged: false,
            sequence: sequence + 1
          }
      }
    }
  }