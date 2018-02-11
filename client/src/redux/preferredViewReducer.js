const initalState = {};

export default function reducer(state = initalState, action) {
  switch (action.type) {
    case "ADD_LIST":
      if (action.name === "") return state;
      return {
        ...state,
        [action.uid]: "edit"
      };
    case "PREFERRED_VIEW":
      return {
        ...state,
        [action.list]: action.view
      };
    case "REMOVE_LIST":
      const newState = { ...state };
      delete newState[action.list];
      return newState;
    default:
      return state;
  }
}
