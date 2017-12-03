import sync from "./syncReducer";

export default (endpoint, key) => {
    const requestInFlight = false;
    let syncLog = [];
    return store => next => action => {
        const startSync = () => {
            requestInFlight = true;
            const actionsToSync = syncLog.splice(0, syncLog.length); 
            fetch(endpont, {
                method: 'post',
                headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    startFrom: store.getState()[key].sequence - actionsToSync.length,
                    actions: actionsToSync
                })
            })
            .then(res=> res.json())
            .then(res => {
                if (res.replayFrom) {
                    next({
                        type: '@@sync/MERGE',
                        undo: store.getState()[key].sequence - res.replayFrom,
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
                // sync failed, try again
                syncLog = actionsToSync.concat(syncLog);
                startSync();
            });
        };
        syncLog.push(action);
        if (!requestInFlight) {
            startSync();
        }

        console.log('dispatching', action)
        let result = next(action)
        console.log('next state', store.getState())
        return result
    };
}