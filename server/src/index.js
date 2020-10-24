const fs = require("fs");
const express = require("express");
const noop = require("express-noop");
const bodyParser = require("body-parser");
const cors = require("cors");
const basicauth = require("basicauth-middleware");
const jwt = require("jsonwebtoken");
const jwtExpress = require("express-jwt");
const scrypt = require("scrypt");
const trace = require("debug")("trace");
const info = require("debug")("info");
const error = require("debug")("error");
const { Pool } = require("pg");

const schema = fs.readFileSync(__dirname + "/schema.sql", "utf8");

const dbConfig = {
  connectionString: process.env.DATABASE_URL || "postgresql://localhost/ekofe",
  ssl: process.env.DISABLE_SSL
    ? false
    : {
        rejectUnauthorized: false,
      },
};

let db;
let retryDelay = 1000;

async function initDb() {
  try {
    db = new Pool(dbConfig);

    await db.query(schema);
  } catch (e) {
    error(`failed setting up db connection, retrying in ${retryDelay}ms`, e);
    await new Promise((res) => {
      setTimeout(res, retryDelay);
      retryDelay *= 1.3;
    });
    await initDb();
  }
  info("Database set up");
}

(async () => {
  const seed = process.env.SEED;

  const app = express();
  const expressWs = require("express-ws")(app);
  app.use(bodyParser.json({ type: "application/json", limit: "2mb" }));
  app.use(cors());

  const clients = {};

  const scryptParams = scrypt.paramsSync(0.2);

  app.post(
    "/token",
    process.env.PASSWORD ? basicauth("user", process.env.PASSWORD) : noop(),
    async (req, res) => {
      const { username, password } = req.body;

      try {
        const resultDb = await db.query(
          "SELECT kdf FROM users WHERE username=$1::text",
          [username]
        );

        if (resultDb.rows.length) {
          const user = resultDb.rows[0];
          const result = await scrypt.verifyKdf(
            new Buffer(user.kdf, "base64"),
            password
          );
          if (result) {
            res.json(jwt.sign({ username: username }, process.env.SECRET));
          } else {
            res.send(401);
          }
        } else {
          const kdf = await scrypt.kdf(password, scryptParams);
          await db.query(
            "INSERT INTO users(username,kdf) VALUES($1::text,$2::text)",
            [username, kdf.toString("base64")]
          );
          res.json(jwt.sign({ username: username }, process.env.SECRET));
        }
      } catch (err) {
        error(err);
        res.status(500).end(err);
      }
    }
  );

  app.post(
    "/api",
    jwtExpress({ secret: process.env.SECRET }),
    async (req, res) => {
      const { startFrom, actions, snapshot, version } = req.body;

      const transaction = await db.connect();
      await transaction.query("BEGIN");
      try {
        const dbResult = await transaction.query(
          "SELECT snapshot_version, snapshot_sequence, LENGTH(snapshot_content) as snapshot_size, actions[$2::int:] as actions FROM users WHERE username=$1::text",
          [req.user.username, startFrom + 1]
        );
        const storedActions = dbResult.rows[0].actions || [];
        const actionCount = startFrom + storedActions.length;
        const storedSnapshot = dbResult.rows[0] || {};

        if (actions.length > 0) {
          await transaction.query(
            "UPDATE users SET actions = array_cat((SELECT actions FROM users WHERE username=$1::text),$2::text[]) WHERE username=$1::text",
            [req.user.username, actions.map((action) => String(action))]
          );
        }

        const newActions = storedActions.concat(actions);

        const sequence = actionCount;
        let storedSnapshotSequence = storedSnapshot.snapshot_sequence || 0;
        let storedSnapshotVersion = storedSnapshot.snapshot_version || 0;
        trace(storedSnapshotSequence);
        trace(storedSnapshotVersion);
        trace(sequence);
        trace(newActions);
        if (snapshot) {
          info(`Trying to store snapshot`);
          if (
            (storedSnapshotVersion === undefined ||
              version >= storedSnapshotVersion) &&
            startFrom === sequence
          ) {
            info(`Storing snapshot`);
            const snapshotSequence = sequence + actions.length;
            await transaction.query(
              "UPDATE users SET snapshot_version = $1::int, snapshot_content = $2::text, snapshot_sequence = $3::int WHERE username = $4::text",
              [parseInt(version), snapshot, snapshotSequence, req.user.username]
            );
            storedSnapshotSequence = snapshotSequence;
            storedSnapshotVersion = version;
          }
        }
        const baseAnswer = {
          snapshotSequence:
            version === storedSnapshotVersion ? storedSnapshotSequence : 0,
          seed,
        };

        if (startFrom < sequence) {
          if (
            !snapshot &&
            version === storedSnapshotVersion &&
            storedSnapshotSequence > startFrom &&
            JSON.stringify(newActions).length > storedSnapshot.snapshot_size
          ) {
            const snapshotContentResult = await transaction.query(
              "SELECT snapshot_content FROM users WHERE username = $1::text",
              [req.user.username]
            );
            res.json({
              ...baseAnswer,
              replayFrom: startFrom,
              replayLog: newActions.slice(storedSnapshotSequence - startFrom),
              snapshot: snapshotContentResult.rows[0].snapshot_content,
            });
          } else {
            res.json({
              ...baseAnswer,
              replayFrom: startFrom,
              replayLog: newActions,
            });
          }
        } else {
          res.json({
            ...baseAnswer,
          });
        }
        if (actions.length > 0) {
          (clients[req.user.username] || []).forEach(
            (c) => c.session !== req.headers["x-sync-session"] && c.ws.send("")
          );
        }
        info(`New action log length: ${sequence + actions.length}`);
        await transaction.query("COMMIT");
      } catch (err) {
        await transaction.query("ROLLBACK");
        error(err);
        res.status(500).end(err);
      } finally {
        transaction.release();
      }
    }
  );

  app.ws("/api/updates/:session", (ws, req) => {
    const jwtTokenString = req.headers["sec-websocket-protocol"];
    try {
      const jwtToken = jwt.verify(jwtTokenString, process.env.SECRET);
      info("new update listener");
      if (!clients[jwtToken.username]) {
        clients[jwtToken.username] = [];
      }
      clients[jwtToken.username].push({ ws, session: req.params.session });
      ws.on("close", () => {
        info("update listener disconnected");
        clients[jwtToken.username] = clients[jwtToken.username].filter(
          (c) => c.ws !== ws
        );
      });
    } catch (err) {
      error(err);
      ws.close();
    }
  });

  const port = process.env.PORT || 3001;
  const server = app.listen(port, () => {
    initDb();
    info(`Ekofe server listening on port ${port}!`);
  });

  // gracefully shut down when receiving sigterm
  process.on("SIGTERM", function () {
    pool.end();
    server.close(function () {
      process.exit(0);
    });
  });
})();
