import { isNumber } from "util";

export default (postActionCreator, checkAndUpdateSeed, filter, key, reducerVersion, compatVersion) => {
  let syncLog;
  let lastServerSnapshotSequence = Number.MAX_SAFE_INTEGER;
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
    const shouldUpdateSnapshot = () => {
      const currentState = getSyncState();
      const sequenceDelta = currentState.sequence - lastServerSnapshotSequence;
      // TODO this heuristic can be a lot smarter than that...
      // TODO make this configurable since some types of states don't benefit from regular snapshotting
      // don't attempt to post snapshots if we reduced incompatible actions earlier
      return !currentState.purgeOnCompatLevel && sequenceDelta > 500;
    };
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
        actions: actionsToSync,
        snapshot: shouldUpdateSnapshot() ? getSyncState().present : false,
        // don't attempt to get snapshots and send an invalid version if we reduced incompatible actions earlier
        // just run along in compat mode
        version: getSyncState().purgeOnCompatLevel ? "COMPAT_MODE" : reducerVersion
      })
        .then(res => {
          lastServerSnapshotSequence = res.snapshotSequence;
          if (!checkAndUpdateSeed(res.seed)) {
            console.log("purging local state, server has another seed");
            // server has another seed than the client, purge all data and resync
            next({
              type: "@@sync/PURGE",
              key
            });
            requestInFlight = false;
            lastServerSnapshotSequence = Number.MAX_SAFE_INTEGER;
            startSync();
          } else if (isNumber(res.replayFrom)) {
            next({
              type: "@@sync/MERGE",
              key,
              undo: getSyncState().sequence - res.replayFrom,
              localLogLength: syncLog.length ? syncLog.length : 0,
              replayLog: res.replayLog.concat(syncLog),
              snapshot: res.snapshot,
              snapshotSequence: res.snapshotSequence
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
      if (action.type === "@@sync/REQUEST_SYNC" && oldState.purgeOnCompatLevel <= compatVersion ) {
        // an incompatible action was reduced in the past and now the reducer is updated for this action.
        // issue a purge and re-sync to reduce this action again (or maybe there is a snapshot available?)

        // TODO this is not completely clean since the re-sync could put you back into compat mode, just at a higher level
        // (although very unlikely when working with web apps) and in this case snapshots would be incorrectly used.
        // the sync directly after a purge should not rely on snapshots. But because this is highly unlikely and could
        // cost a whole lot of performance (reducing a lot of actions is way costlier than using a semi-up-to-date snapshot)
        // this case is not caught here
        const result = next({ type: "@@sync/PURGE", key });
        startSync();
        return result;
      } else {
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
      }
    };
  };
};
