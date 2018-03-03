import uuid from "uuid/v4";
import storage from "redux-persist/es/storage";
import sessionStorage from 'redux-persist/es/storage/session';
import createCompressor from "redux-persist-transform-compress";

// cleans the client-state completely on update (including credentials)
export const APP_VERSION = 5;

// issues a purge and re-sync from the server on update (only list-data)
export const REDUCER_VERSION = 6;

const isThrowawayAccount = window.location.host.split(".")[0] !== "throwaway";

const compressor = createCompressor();
export const persistConfig = {
  key: `ekofe-${APP_VERSION}`,
  storage: (isThrowawayAccount ? sessionStorage : storage),
  transforms: [compressor]
};

export const API_PROTOCOL = window.location.protocol;

export const API_HOST =
  window.location.hostname === "localhost"
    ? "localhost:3001"
    : window.location.host;

export const clientSession = uuid();
