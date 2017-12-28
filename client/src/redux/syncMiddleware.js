import { API_PROTOCOL, API_HOST, clientSession } from "../config";
import syncMiddleware from "../sync/syncMiddleware";

const postActionCreator = store => req =>
  fetch(`${API_PROTOCOL}//${API_HOST}/api`, {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-Sync-Session": clientSession,
      Authorization: `Bearer ${store.getState().user.token}`
    },
    body: JSON.stringify(req)
  })
    .then(res => res.json())
    .catch(e => {
      console.log(e);
      throw e;
    });

const syncFilter = action => action.type !== "persist/REHYDRATE";

export default syncMiddleware(postActionCreator, syncFilter, "lists");
