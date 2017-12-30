import { API_PROTOCOL, API_HOST } from "../config";

const performLogin = (username, password) =>
  fetch(`${API_PROTOCOL}//${API_HOST}/token`, {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  }).then(res => res.json());

export default store => next => action => {
  const result = next(action);
  if (action.type === "LOGIN") {
    performLogin(action.username, action.password).then(token => {
      next({ type: "LOGIN_SUCCESS", token: token });
      next({
        type: "@@sync/PURGE",
        key: "lists"
      });
    });
  }
  return result;
};
