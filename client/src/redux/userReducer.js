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
        username: action.username || state.username,
        password: action.password || state.password
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        requesting: false,
        failed: false,
        loggedIn: true,
        token: action.token
      };
    default:
      return state;
  }
}
