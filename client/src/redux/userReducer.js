const initalState = {
  loggedIn: false,
  requesting: false,
  failed: false,
  username: "",
  password: ""
};

export default function reducer(state = initalState, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        requesting: true,
        username: action.username || state.username,
        password: action.password || state.password,
        encryptionKey: action.encryptionKey || state.encryptionKey
      };
    case "LOGOUT":
      return {
        ...initalState
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        requesting: false,
        loggedIn: true,
        token: action.token
      };
    case "@@sync/SYNC_FAILED":
      if (action.reason.message === "unauthorized") {
        return {
          ...state,
          requesting: false,
          loggedIn: false,
          token: undefined
        };
      } else return state;
    default:
      return state;
  }
}
