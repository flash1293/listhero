import { isNumber } from "util";

export default (postActionCreator, checkAndUpdateSeed, filter, key) => {
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
  const setLengthInFlight = len => {
    localStorage.setItem(`currently-syncing:${key}`, len);
  };
  const getLengthInFlight = () => {
    return Number(localStorage.getItem(`currently-syncing:${key}`));
  };
  let requestInFlight = false;
  loadSyncLog();
  return store => next => {
    const postAction = postActionCreator(store);
    const getSyncState = () => store.getState()[key];
    const startSync = (
      options = { skipRetry: false, dontMarkNewSync: false }
    ) => {
      if (requestInFlight) return;
      requestInFlight = true;
      const persistedLengthInFlight = getLengthInFlight();
      console.log(
        `attempting sync, ${persistedLengthInFlight} marked for syncing`
      );
      if (persistedLengthInFlight === 0 && !options.dontMarkNewSync) {
        next({
          type: "@@sync/START_SYNC",
          key
        });
      }
      const actionsToSync = syncLog.splice(
        0,
        persistedLengthInFlight === 0 ? syncLog.length : persistedLengthInFlight
      );
      setLengthInFlight(actionsToSync.length);
      console.log(`syncing ${actionsToSync.length} actions`);
      postAction({
        startFrom:
          getSyncState().sequence - syncLog.length - actionsToSync.length,
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
            requestInFlight = false;
            startSync();
          } else if (isNumber(res.replayFrom)) {
            next({
              type: "@@sync/MERGE",
              key,
              undo: getSyncState().sequence - res.replayFrom,
              localLogLength: syncLog.length ? syncLog.length : 0,
              replayLog: res.replayLog.concat(syncLog)
            });
          } else {
            next({
              type: "@@sync/SYNC",
              key
            });
          }
          // no requests in flight any more
          setLengthInFlight(0);
          if (syncLog.length > 0) {
            console.log("sync completed, restarting for new changes");
            saveSyncLog();
            requestInFlight = false;
            startSync({ dontMarkNewSync: true });
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
          // TODO recover actionsToSync if app is quit during an ongoing sync (can this even happen in modern browsers?)
          // sync failed, prepend actions which were selected to sync back to the synclog and try again
          syncLog = actionsToSync.concat(syncLog);
          if (options.skipRetry) {
            console.log("sync failed");
            requestInFlight = false;
          } else {
            debugger;
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
      if (
        (action.type === "@@sync/REQUEST_SYNC" ||
          action.type === "@@sync/PURGE") &&
        action.key === key &&
        !requestInFlight
      ) {
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
