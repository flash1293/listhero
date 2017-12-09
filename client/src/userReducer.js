const initalState = {
  loggedIn: false,
  requesting: false,
  failed: false,
  password: ""
};

export default function reducer(state = initalState, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        requesting: true,
        failed: false,
        password: action.password
      };
    case "@@sync/SYNC":
    case "@@sync/MERGE":
      if (state.requesting) {
        return {
          ...state,
          requesting: false,
          loggedIn: true,
          failed: false
        };
      } else {
        return state;
      }
    case "@@sync/SYNC_FAILED":
      return {
        ...state,
        requesting: false,
        loggedIn: false,
        failed: true
      };
    default:
      return state;
  }
}
