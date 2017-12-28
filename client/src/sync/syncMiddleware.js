import { isNumber } from "util";

export default (postActionCreator, filter, key) => {
  let syncLog;
  const saveSyncLog = () => {
    localStorage.setItem(`sync-log:${key}`, JSON.stringify(syncLog));
  };
  const loadSyncLog = () => {
    const serializedLog = localStorage.getItem(`sync-log:${key}`);
    if (serializedLog) {
      syncLog = JSON.parse(serializedLog);
    } else {
      syncLog = [];
    }
  };
  const checkAndUpdateSeed = seed => {
    const storageKey = `sync-seed:${key}`;
    const savedSeed = localStorage.getItem(storageKey);
    if (savedSeed) {
      const isCorrect = seed === savedSeed;
      if (!isCorrect) {
        localStorage.setItem(storageKey, seed);
      }
      return isCorrect;
    }
    localStorage.setItem(storageKey, seed);
    return true;
  };
  let requestInFlight = false;
  loadSyncLog();
  return store => next => {
    const postAction = postActionCreator(store);
    const getSyncState = () => store.getState()[key];
    const startSync = (options = { skipRetry: false }) => {
      if (requestInFlight) return;
      console.log("attempting sync");
      requestInFlight = true;
      const actionsToSync = syncLog.splice(0, syncLog.length);
      postAction({
        startFrom: getSyncState().sequence - actionsToSync.length,
        actions: actionsToSync
      })
        .then(res => {
          if (!checkAndUpdateSeed(res.seed)) {
            console.log("purging local state, server has another seed");
            // server has another seed than the client, purge all data and resync
            next({
              type: "@@sync/PURGE",
              key
            });
            startSync();
          } else if (isNumber(res.replayFrom)) {
            next({
              type: "@@sync/MERGE",
              key,
              undo: getSyncState().sequence - res.replayFrom,
              replayLog: res.replayLog.concat(syncLog)
            });
          } else {
            next({
              type: "@@sync/SYNC",
              key
            });
          }
          if (syncLog.length > 0) {
            console.log("sync completed, restarting for new changes");
            saveSyncLog();
            startSync();
          } else {
            console.log("sync completed");
            saveSyncLog();
            requestInFlight = false;
          }
        })
        .catch(reason => {
          next({
            type: "@@sync/SYNC_FAILED",
            reason,
            key
          });
          // sync failed, prepend actions which were selected to sync back to the synclog and try again
          syncLog = actionsToSync.concat(syncLog);
          if (options.skipRetry) {
            console.log("sync failed");
            requestInFlight = false;
          } else {
            console.log("sync failed, retry in 1 second");
            setTimeout(() => {
              requestInFlight = false;
              startSync();
            }, 1000);
          }
        });
    };
    return action => {
      const oldState = getSyncState();
      const result = next(action);
      if (action.type === "@@sync/REQUEST_SYNC" && action.key === key) {
        startSync({ skipRetry: action.skipRetry });
      } else {
        if (oldState !== getSyncState() && filter(action)) {
          syncLog.push(action);
          saveSyncLog();
          startSync();
        }
      }
      return result;
    };
  };
};
