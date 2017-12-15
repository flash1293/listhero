export const refreshOnRehydrateMiddleware = store => next => action => {
  let result = next(action);
  if (action.type === "persist/REHYDRATE" && store.getState().user.loggedIn) {
    next({
      type: "@@sync/REQUEST_SYNC",
      key: "lists"
    });
  }
  return result;
};
