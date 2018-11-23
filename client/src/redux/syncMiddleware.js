import aes from "aes-js";
import compose from "ramda/src/compose";

import {
  API_PROTOCOL,
  API_HOST,
  clientSession,
  REDUCER_VERSION,
  COMPAT_VERSION
} from "../config";
import syncMiddleware from "../sync/syncMiddleware";
import { getRandomData } from "./utils";

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
  const seed = getRandomData(128);
  const crypt = new aes.ModeOfOperation.ctr(
    key,
    new aes.Counter(seed)
  );
  return `0x${aes.utils.hex.fromBytes(seed)};${compose(
    aes.utils.hex.fromBytes,
    crypt.encrypt.bind(crypt),
    aes.utils.utf8.toBytes,
    escape
  )(data)}`;
};

function getSeed(seed) {
  if (seed.startsWith("0x")) {
    return aes.utils.hex.toBytes(seed.substring(2));
  } else {
    return Number(seed);
  }
}

const decrypt = (data, key) => {
  const [seed, seededData] = data.split(";");
  const convertedSeed = seededData ? getSeed(seed) : 1;
  const crypt = new aes.ModeOfOperation.ctr(
    key,
    new aes.Counter(convertedSeed)
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
        encrypt(
          JSON.stringify(action),
          store.getState().user.encryptionKey
        )
      ),
      snapshot: req.snapshot ? encrypt(JSON.stringify(req.snapshot), store.getState().user.encryptionKey) : false
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
          JSON.parse(
            decrypt(action, store.getState().user.encryptionKey)
          )
        );
      }
      if (jsonRes.snapshot) {
        jsonRes.snapshot = JSON.parse(decrypt(jsonRes.snapshot, store.getState().user.encryptionKey));
      }
      return jsonRes;
    });

const syncFilter = action => action.type !== "persist/REHYDRATE";

export default syncMiddleware(
  postActionCreator,
  checkAndUpdateSeed,
  syncFilter,
  "lists",
  REDUCER_VERSION,
  COMPAT_VERSION
);
