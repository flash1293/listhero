import aes from "aes-js";
import compose from "ramda/src/compose";

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

const encrypt = (data, key) => {
  const seed = Math.floor(Math.random() * (Math.pow(2, 40) - 1));
  const crypt = new aes.ModeOfOperation.ctr(key, new aes.Counter(seed));
  return `${seed};${compose(
    aes.utils.hex.fromBytes,
    crypt.encrypt.bind(crypt),
    aes.utils.utf8.toBytes,
    escape
  )(data)}`;
};

const decrypt = (data, key) => {
  const [seed, seededData] = data.split(";");
  const crypt = new aes.ModeOfOperation.ctr(
    key,
    new aes.Counter(seededData ? Number(seed) : 1)
  );
  return compose(
    unescape,
    aes.utils.utf8.fromBytes,
    crypt.decrypt.bind(crypt),
    aes.utils.hex.toBytes
  )(seededData ? seededData : data);
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
    body: JSON.stringify({
      ...req,
      actions: req.actions.map(action =>
        encrypt(JSON.stringify(action), store.getState().user.encryptionKey)
      )
    })
  })
    .then(res => {
      if (res.status === 401) {
        throw new Error("unauthorized");
      }
      return res.json();
    })
    .then(jsonRes => {
      if (jsonRes.replayLog) {
        jsonRes.replayLog = jsonRes.replayLog.map(action =>
          JSON.parse(decrypt(action, store.getState().user.encryptionKey))
        );
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
