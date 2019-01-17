const initalState = { currentList: undefined, lastList: undefined };

export default function reducer(state = initalState, action) {
  switch (action.type) {
    case "VISIT_LIST":
      if(state.currentList !== action.uid) {
        return { currentList: action.uid, lastList: state.currentList };
      } else {
        return state;
      }
    default:
      return state;
  }
}
