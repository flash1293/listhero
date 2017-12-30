import {
  API_PROTOCOL,
  API_HOST,
  clientSession,
  REDUCER_VERSION
} from "../config";
import syncMiddleware from "../sync/syncMiddleware";

const checkAndUpdateSeed = seed => {
  const storageKey = `sync-seed:lists`;
  const savedSeed = localStorage.getItem(storageKey);
  const versionedSeed = `${seed}:${REDUCER_VERSION}`;
  if (savedSeed) {
    const isCorrect = versionedSeed === savedSeed;
    if (!isCorrect) {
      localStorage.setItem(storageKey, versionedSeed);
    }
    return isCorrect;
  }
  localStorage.setItem(storageKey, versionedSeed);
  return true;
};

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
    .then(res => {
      if (res.status === 401) {
        throw new Error("unauthorized");
      }
      return res.json();
    })
    .then(jsonRes => {
      if (jsonRes.replayLog) {
        jsonRes.replayLog = jsonRes.replayLog.map(action => JSON.parse(action));
      }
      return jsonRes;
    });

const syncFilter = action => action.type !== "persist/REHYDRATE";

export default syncMiddleware(
  postActionCreator,
  checkAndUpdateSeed,
  syncFilter,
  "lists"
);
