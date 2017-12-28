import { persistStore, persistReducer } from "redux-persist";
import { createStore, combineReducers, applyMiddleware } from "redux";

import syncReducer from "../sync/syncReducer";
import listReducer from "./listReducer";
import userReducer from "./userReducer";
import { persistConfig } from "../config";
import websocketMiddleware from "./websocketMiddleware";
import { refreshOnRehydrateMiddleware } from "./refreshOnRehydrateMiddleware";
import syncMiddleware from "./syncMiddleware";
import loginMiddleware from "./loginMiddleware";

const persistentReducer = persistReducer(
  persistConfig,
  combineReducers({
    lists: syncReducer(listReducer, "lists"),
    user: userReducer
  })
);
export const store = createStore(
  persistentReducer,
  applyMiddleware(
    refreshOnRehydrateMiddleware,
    loginMiddleware,
    websocketMiddleware,
    syncMiddleware
  )
);
export const persistor = persistStore(store);
