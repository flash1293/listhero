const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const basicauth = require("basicauth-middleware");
const Redis = require("ioredis");
const redis = new Redis(6379, process.env.REDIS_HOST || "db");
const jwt = require("jsonwebtoken");
const jwtExpress = require("express-jwt");
const scrypt = require("scrypt");

const seed = process.env.SEED;

const app = express();
const expressWs = require("express-ws")(app);
app.use(bodyParser.json({ type: "application/json" }));
app.use(cors());

const clients = {};

const scryptParams = scrypt.paramsSync(1);

app.post("/token", (req, res) => {
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
  });
});

app.post("/api", jwtExpress({ secret: process.env.SECRET }), (req, res) => {
  const stream = `stream-${req.user.username}`;
  const { startFrom, actions } = req.body;
  const commands = [["llen", stream]];
  if (actions.length > 0) {
    commands.push(
      ["rpush", stream].concat(actions.map(action => String(action)))
    );
  }
  commands.push(["lrange", stream, startFrom, -1]);
  console.log(commands);
  redis.multi(commands).exec((err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    const sequence = results[0][1];
    const newActions = actions.length > 0 ? results[2][1] : results[1][1];
    console.log(sequence);
    console.log(newActions);
    if (startFrom < sequence) {
      res.json({
        replayFrom: startFrom,
        replayLog: newActions,
        seed
      });
    } else {
      res.json({
        seed
      });
    }
    if (actions.length > 0) {
      (clients[req.user.username] || []).forEach(
        c => c.session !== req.headers["x-sync-session"] && c.ws.send("")
      );
    }
    console.log(`New action log length: ${sequence + actions.length}`);
  });
});

app.ws("/api/updates/:session", (ws, req) => {
  const jwtTokenString = req.headers["sec-websocket-protocol"];
  try {
    const jwtToken = jwt.verify(jwtTokenString, process.env.SECRET);
    console.log("new update listener");
    if (!clients[jwtToken.username]) {
      clients[jwtToken.username] = [];
    }
    clients[jwtToken.username].push({ ws, session: req.params.session });
    ws.on("close", () => {
      console.log("update listener disconnected");
      clients[jwtToken.username] = clients[jwtToken.username].filter(
        c => c.ws !== ws
      );
    });
  } catch (e) {
    console.log(e);
    ws.close();
  }
});

const server = app.listen(3001, () =>
  console.log("Ekofe server listening on port 3001!")
);

process.on("SIGTERM", function() {
  server.close(function() {
    process.exit(0);
  });
});
