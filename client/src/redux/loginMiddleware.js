import { API_PROTOCOL, API_HOST } from "../config";

const performLogin = (username, password, serverPassword) =>
  fetch(`${API_PROTOCOL}//${API_HOST}/token`, {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization: (serverPassword ? `Basic ${btoa("user:" + serverPassword)}` : ''),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  }).then(res => res.json());

export default store => next => action => {
  const result = next(action);
  if (action.type === "LOGIN") {
    performLogin(action.username, action.password, action.serverPassword)
      .then(token => {
        next({ type: "LOGIN_SUCCESS", token: token });
        next({
          type: "@@sync/PURGE",
          key: "lists"
        });
      })
      .catch(e => {
        next({ type: "LOGIN_FAILURE" });
      });
  }
  return result;
};
