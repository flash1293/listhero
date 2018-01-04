import uuid from "uuid/v4";
import storage from "redux-persist/es/storage";

// cleans the client-state completely on update (including credentials)
export const APP_VERSION = 5;

// issues a purge and re-sync from the server on update (only list-data)
export const REDUCER_VERSION = 4;

export const persistConfig = {
  key: `ekofe-${APP_VERSION}`,
  storage
};

export const API_PROTOCOL = window.location.protocol;

export const API_HOST =
  window.location.hostname === "localhost"
    ? "localhost:3001"
    : window.location.host;

export const clientSession = uuid();
