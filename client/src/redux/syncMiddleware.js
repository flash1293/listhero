import { API_PROTOCOL, API_HOST, clientSession } from "../config";
import syncMiddleware from "../sync/syncMiddleware";

const postActionCreator = store => req =>
  fetch(`${API_PROTOCOL}//${API_HOST}/api`, {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-Sync-Session": clientSession,
      Authorization: `Basic ${btoa("user:" + store.getState().user.password)}`
    },
    body: JSON.stringify(req)
  }).then(res => res.json());

const syncFilter = action => action.type !== "persist/REHYDRATE";

export default syncMiddleware(postActionCreator, syncFilter, "lists");
