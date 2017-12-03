import { isNumber } from "util";

export default (postAction, filter, key) => {
    let requestInFlight = false;
    let syncLog = [];
    return store => next => {
        const getSyncState = () => store.getState()[key];
        const startSync = () => {
            if (requestInFlight) return;
            requestInFlight = true;
            const actionsToSync = syncLog.splice(0, syncLog.length); 
            postAction({
                    startFrom: getSyncState().sequence - actionsToSync.length,
                    actions: actionsToSync
            })
            .then(res => {
                if (isNumber(res.replayFrom)) {
                    next({
                        type: '@@sync/MERGE',
                        undo: getSyncState().sequence - res.replayFrom,
                        replayLog: res.replayLog.concat(syncLog)
                    });
                } else {
                    next({
                        type: '@@sync/SYNC'
                    });
                }
                if (syncLog.length > 0) {
                    startSync();
                } else {
                    requestInFlight = false;
                }
            })
            .catch(() => {
                // sync failed, prepend actions which were selected to sync back to the synclog and try again
                syncLog = actionsToSync.concat(syncLog);
                requestInFlight = false;
                setTimeout(startSync, 1000);
            });
        };
        return action => {
            const oldState = getSyncState();
            const result = next(action);
            if (action.type === '@@sync/REQUEST_SYNC') {
                startSync();
            } else {
                if (oldState !== getSyncState() && filter(action)) {
                    syncLog.push(action);
                    startSync();
                }
            }
            return result;
        }
    };
}