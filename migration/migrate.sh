#!/bin/sh
echo "===== Clean out tmp folder"
rm -f /tmp/listhero_*
echo "===== Schedule redis dump and give it time to complete"
ssh -t $LISTHERO_SSH 'docker exec -it ekofe_db_1 redis-cli BGSAVE'
sleep 5
echo "===== Download dump file"
scp $LISTHERO_SSH:/ekofe-data/dump.rdb /tmp/listhero_dump.rdb
echo "===== Convert dump file to JSON"
rdb --command json /tmp/listhero_dump.rdb > /tmp/listhero_dump.json
echo "===== Migrate dump file"
node index.js /tmp/listhero_dump.json
echo "===== Import dumpfile into mongo server"
mongoimport -h $LISTHERO_MONGO_HOST -d $LISTHERO_MONGO_DB -c data -u $LISTHERO_MONGO_USER -p $LISTHERO_MONGO_PASSWORD --jsonArray --file /tmp/listhero_dump.json.migrated.json
echo "===== Clean out tmp folder"
rm -f /tmp/listhero_*
