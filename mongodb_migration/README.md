# MongoDB -> Postgres Migration

This script migrates the data from a mongodb instance to a postgres instance.

Steps:

* Download current status into local file: `mongoexport -h <host> -d <db> -c data -u <username> -p <password> -o data.json`
* Upload to postgres using the script `node index.js /abs/path/to/dump.json`