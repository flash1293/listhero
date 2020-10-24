const fs = require("fs");
const { Client } = require("pg");

const schema = fs.readFileSync(__dirname + "/../server/src/schema.sql", "utf8");

const filename = process.argv[2];

const dump = fs.readFileSync(filename, "utf8");
const collection = dump
  .split("\n")
  .filter((line) => Boolean(line))
  .map((line) => JSON.parse(line));

// Little bit of analytics
console.log(
  "# actions",
  collection.reduce((sum, doc) => sum + doc.actions.length, 0)
);
console.log(
  "top 10 user action counts",
  collection
    .map((doc) => doc.actions.length)
    .sort((a, b) => a - b)
    .reverse()
    .slice(0, 10)
);
console.log("# users", collection.length);

db = new Client({
  connectionString: process.env.CONNECTION_STRING,
  ssl: process.env.DISABLE_SSL
    ? false
    : {
        rejectUnauthorized: false,
      },
});
db.connect()
  .then(async () => {
    await db.query(schema);
    await db.query("DELETE FROM users");
    let imported = 0;
    for (const doc of collection) {
      if (!doc.snapshot) {
        doc.snapshot = {};
      }
      await db.query(
        "INSERT INTO users(username, kdf, snapshot_version, snapshot_content, snapshot_sequence, actions) VALUES($1::text, $2::text, $3::int, $4::text, $5::int, $6::text[])",
        [
          doc.username,
          doc.kdf,
          doc.snapshot.version,
          doc.snapshot.snapshot,
          doc.snapshot.sequence,
          doc.actions,
        ]
      );
      imported++;
      if (imported % 10 === 0) {
        console.log(`Imported ${imported} users`);
      }
    }
    console.log(`Imported ${imported} users`);
    db.end();
  })
  .catch((e) => console.log(e));
