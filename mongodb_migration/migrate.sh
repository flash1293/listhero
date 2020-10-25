#!/bin/sh
echo "===== Clean out tmp folder"
rm -f /tmp/listhero_*
echo "===== Download dump file"
mongoexport -h $LISTHERO_MONGO_HOST -d $LISTHERO_MONGO_DB -c data -u $LISTHERO_MONGO_USER -p $LISTHERO_MONGO_PASSWORD -o /tmp/listhero_dump.json
echo "===== Import dumpfile into postgres server"
DISABLE_SSL=$LISTHERO_POSTGRES_DISABLE_SSL CONNECTION_STRING=$LISTHERO_POSTGRES_CONNECTION_STRING node index.js /tmp/listhero_dump.json
echo "===== Clean out tmp folder"
rm -f /tmp/listhero_*
