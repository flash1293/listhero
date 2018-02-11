import { persistStore, persistReducer } from "redux-persist";
import { createStore, combineReducers, applyMiddleware } from "redux";

import syncReducer from "../sync/syncReducer";
import listReducer from "./listReducer";
import preferredViewReducer from "./preferredViewReducer";
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
    user: userReducer,
    preferredView: preferredViewReducer
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
