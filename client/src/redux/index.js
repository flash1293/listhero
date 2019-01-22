import { persistStore, persistReducer } from "redux-persist";
import { createStore, combineReducers, applyMiddleware } from "redux";

import syncReducer from "../sync/syncReducer";
import listReducer from "./listReducer";
import preferredViewReducer from "./preferredViewReducer";
import enteredTextReducer from "./enteredTextReducer";
import visitedListReducer from "./visitedListReducer";
import userReducer from "./userReducer";
import { persistConfig, COMPAT_VERSION } from "../config";
import websocketMiddleware from "./websocketMiddleware";
import { refreshOnRehydrateMiddleware } from "./refreshOnRehydrateMiddleware";
import syncMiddleware from "./syncMiddleware";
import loginMiddleware from "./loginMiddleware";
import { abortableActionMiddleware, abortableActionReducer } from "../abortable-action";

const persistentReducer = persistReducer(
  persistConfig,
  combineReducers({
    lists: syncReducer(listReducer, "lists", COMPAT_VERSION),
    user: userReducer,
    preferredView: preferredViewReducer,
    enteredText: enteredTextReducer,
    visitedList: visitedListReducer,
    abortableActions: abortableActionReducer
  })
);
export const store = createStore(
  persistentReducer,
  applyMiddleware(
    refreshOnRehydrateMiddleware,
    abortableActionMiddleware,
    loginMiddleware,
    websocketMiddleware,
    syncMiddleware
  )
);
export const persistor = persistStore(store);
