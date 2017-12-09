const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const basicauth = require("basicauth-middleware");

const seed = process.env.SEED;

const app = express();
const expressWs = require("express-ws")(app);
app.use(bodyParser.json({ type: "application/json" }));
app.use(cors());

const logFile = `${process.env.DATA_DIR}/${seed}.data`;
const loadLog = () => {
  if (fs.existsSync(logFile)) {
    const serializedLog = fs.readFileSync(logFile);
    return JSON.parse(serializedLog);
  } else {
    return [];
  }
};

let actionLog = loadLog();
let clients = [];
let unflushedActions = false;

const writeLog = () => {
  if (!unflushedActions) return;
  console.log("flusing actions to disk");
  const serializedLog = JSON.stringify(actionLog);
  fs.writeFile(logFile, serializedLog, () => {});
  unflushedActions = false;
};

setInterval(writeLog, 10000);

app.post("/api", basicauth("user", process.env.PASSWORD), (req, res) => {
  const { startFrom, actions } = req.body;
  const sequence = actionLog.length;
  actionLog = actionLog.concat(actions);
  if (startFrom < sequence) {
    res.json({
      replayFrom: startFrom,
      replayLog: actionLog.slice(startFrom),
      seed
    });
  } else {
    res.json({
      seed
    });
  }
  if (actions.length > 0) {
    unflushedActions = true;
    clients.forEach(
      c => c.session !== req.headers["x-sync-session"] && c.ws.send("")
    );
  }
  console.log(`New action log length: ${actionLog.length}`);
});

app.ws("/api/updates/:session", (ws, req) => {
  if (req.headers["sec-websocket-protocol"] !== process.env.PASSWORD) {
    ws.close();
  } else {
    console.log("new update listener");
    clients.push({ ws, session: req.params.session });
    ws.on("close", () => {
      console.log("update listener disconnected");
      clients = clients.filter(c => c.ws !== ws);
    });
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
