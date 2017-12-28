import uuid from "uuid/v4";
import storage from "redux-persist/es/storage";

export const APP_VERSION = 5;

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
