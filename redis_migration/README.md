# Redis -> MongoDB Migration

This script migrates the data from a redis dump to a json file importable as MongoDB collection.

Steps:

* Log into redis instance and `BGSAVE` to flush everything to disk
* Download dump file (e.g. by `scp`)
* Install [rdp-tools](https://github.com/sripathikrishnan/redis-rdb-tools)
* Convert to json `rdb --command json dump.rdb > dump.json`
* Migrate using the script `node index.js /abs/path/to/dump.json`
* Upload into MongoDB instance using `mongoimport -h <host> -d <db> -c data -u <username> -p <password> --file dump.json.migrated.json -v --jsonArray` 