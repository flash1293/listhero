const initalState = {};

export default function reducer(state = initalState, action) {
  switch (action.type) {
    case "ADD_LIST":
      if (action.name === "") return state;
      return {
        ...state,
        [action.uid]: ""
      };
    case "ADD_ITEM":
      if (!action.name) return state;
      return {
        ...state,
        [action.list]: ""
      };
    case "CHANGE_ENTERED_TEXT":
      return {
        ...state,
        [action.list]: action.text
      };
    case "REMOVE_LIST":
      const newState = { ...state };
      delete newState[action.list];
      return newState;
    default:
      return state;
  }
}
