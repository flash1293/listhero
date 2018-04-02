import aes from "aes-js";
import { aes256 } from "aes-wasm";
import compose from "ramda/src/compose";

import {
  API_PROTOCOL,
  API_HOST,
  clientSession,
  REDUCER_VERSION
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

let aes256Instance;
function getAesInstance() {
  if(!aes256Instance) {
    return aes256().then(instance => {
      aes256Instance = instance;
      return instance;
    });
  } else {
    return Promise.resolve(aes256Instance);
  }
}

const encrypt = (crypt, data, key) => {
  const seed = getRandomData(128);
  crypt.init(key, seed, 'CTR');
  return `0x${aes.utils.hex.fromBytes(seed)};${compose(
    aes.utils.hex.fromBytes,
    crypt.encrypt,
    aes.utils.utf8.toBytes,
    escape
  )(data)}`;
};

function getSeed(seed) {
  if(seed.startsWith('0x')) {
    return aes.utils.hex.toBytes(seed.substring(2));
  } else {
    return Number(seed);
  }
}

const decrypt = (crypt, data, key) => {
  const [seed, seededData] = data.split(";");
  const convertedSeed = seededData ? getSeed(seed) : 1;
  if(Number.isInteger(convertedSeed)) {
    // legacy action, decrypt with aes-js
    const legacyCrypt = new aes.ModeOfOperation.ctr(
      key,
      new aes.Counter(convertedSeed)
    );
    return compose(
      unescape,
      aes.utils.utf8.fromBytes,
      legacyCrypt.decrypt.bind(legacyCrypt),
      aes.utils.hex.toBytes
    )(seededData ? seededData : data);
  } else {
    // modern action, decrypt with aes-wasm
    crypt.init(key, new Uint8Array(convertedSeed), 'CTR');
    return compose(
      unescape,
      aes.utils.utf8.fromBytes,
      crypt.decrypt,
      aes.utils.hex.toBytes
    )(seededData ? seededData : data);
  }
};

const postActionCreator = store => req =>
  getAesInstance()
    .then(crypt => fetch(`${API_PROTOCOL}//${API_HOST}/api`, {
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
        encrypt(crypt, JSON.stringify(action), store.getState().user.encryptionKey)
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
          JSON.parse(decrypt(crypt, action, store.getState().user.encryptionKey))
        );
      }
      return jsonRes;
    }))
  ;

const syncFilter = action => action.type !== "persist/REHYDRATE";

export default syncMiddleware(
  postActionCreator,
  checkAndUpdateSeed,
  syncFilter,
  "lists"
);
