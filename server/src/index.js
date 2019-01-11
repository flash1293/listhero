const express = require("express");
const noop = require("express-noop");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const basicauth = require("basicauth-middleware");
const Redis = require("ioredis");
const redis = new Redis(6379, process.env.REDIS_HOST || "db");
const jwt = require("jsonwebtoken");
const jwtExpress = require("express-jwt");
const scrypt = require("scrypt");
const trace = require('debug')('trace');
const info = require('debug')('info');
const error = require('debug')('error');

const seed = process.env.SEED;

const app = express();
const expressWs = require("express-ws")(app);
app.use(bodyParser.json({ type: "application/json", limit: "2mb" }));
app.use(cors());

const clients = {};

const scryptParams = scrypt.paramsSync(0.2);

app.post("/token", (process.env.PASSWORD ? basicauth("user", process.env.PASSWORD) : noop()), (req, res) => {
  const { username, password } = req.body;

  redis.hexists("users", username).then(exists => {
    if (exists) {
      return redis
        .hget("users", username)
        .then(user => JSON.parse(user))
        .then(user =>
          scrypt.verifyKdf(new Buffer(user.kdf, "base64"), password)
        )
        .then(result => {
          if (result) {
            res.json(jwt.sign({ username: username }, process.env.SECRET));
          } else {
            res.send(401);
          }
        });
    } else {
      return scrypt
        .kdf(password, scryptParams)
        .then(kdf =>
          redis.hset(
            "users",
            username,
            JSON.stringify({ kdf: kdf.toString("base64") })
          )
        )
        .then(() =>
          res.json(jwt.sign({ username: username }, process.env.SECRET))
        );
    }
  }).catch(err => {
    error(err);
    res.status(500).end(err);
  });
});

app.post("/api", jwtExpress({ secret: process.env.SECRET }), async (req, res) => {
  const stream = `stream-${req.user.username}`;
  const { startFrom, actions, snapshot, version } = req.body;
  const snapshotKey = `snapshot-${req.user.username}`;
  const commands = [["llen", stream]];
  commands.push(["hget", snapshotKey, "version"]);
  commands.push(["hget", snapshotKey, "sequence"]);
  if (actions.length > 0) {
    commands.push(
      ["rpush", stream].concat(actions.map(action => String(action)))
    );
  }
  commands.push(["lrange", stream, startFrom, -1]);
  trace(commands);
  try {
    const results = await redis.multi(commands).exec()
    const sequence = results[0][1];
    let storedSnapshotSequence = results[1][1] ? parseInt(results[1][1]) : 0;
    let storedSnapshotVersion = results[2][1] ? parseInt(results[2][1]) : undefined;
    const newActions = actions.length > 0 ? results[4][1] : results[3][1];
    trace(storedSnapshotSequence);
    trace(storedSnapshotVersion);
    trace(sequence);
    trace(newActions);
    if(snapshot) {
      info(`Trying to store snapshot`);
      if((storedSnapshotVersion === undefined || storedSnapshotVersion >= version) &&
        startFrom === sequence ) {
        info(`Storing snapshot`);
        const snapshotSequence = sequence + actions.length;
        await redis.multi([
          ["hset", snapshotKey, "version", version],
          ["hset", snapshotKey, "snapshot", snapshot],
          ["hset", snapshotKey, "sequence", snapshotSequence]
        ]).exec();
        storedSnapshotSequence = snapshotSequence;
        storedSnapshotVersion = version;
      }
    }
    if (startFrom < sequence) {
      const storedSnapshot = await redis.hget(snapshotKey, "snapshot");
      if (!snapshot && version === storedSnapshotVersion &&
        storedSnapshotSequence > startFrom && JSON.stringify(newActions).length > storedSnapshot.length) {
          res.json({
            replayFrom: startFrom,
            replayLog: newActions.slice(storedSnapshotSequence - startFrom),
            snapshot: storedSnapshot,
            snapshotSequence: storedSnapshotSequence,
            seed
          });
      } else {
        res.json({
          replayFrom: startFrom,
          replayLog: newActions,
          snapshotSequence: storedSnapshotSequence,
          seed
        });
      }
    } else {
      res.json({
        snapshotSequence: storedSnapshotSequence,
        seed
      });
    }
    if (actions.length > 0) {
      (clients[req.user.username] || []).forEach(
        c => c.session !== req.headers["x-sync-session"] && c.ws.send("")
      );
    }
    info(`New action log length: ${sequence + actions.length}`);
  } catch (err) {
    error(err);
    res.status(500).end(err);
    return;
  }
});

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
        c => c.ws !== ws
      );
    });
  } catch (err) {
    error(err);
    ws.close();
  }
});

const server = app.listen(3001, () =>
  info("Ekofe server listening on port 3001!")
);

process.on("SIGTERM", function() {
  server.close(function() {
    process.exit(0);
  });
});
