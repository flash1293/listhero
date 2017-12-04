const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const uuid = require('uuid/v4');

const app = express();
const expressWs = require('express-ws')(app);
app.use(bodyParser.json({ type: 'application/json' }));
app.use(cors());

let actionLog = [];
let clients = [];
let seed = uuid();

app.post('/', (req, res) => {
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
  if(actions.length > 0) {
    clients.forEach(c => c.session !== req.headers['x-sync-session'] && c.ws.send(""));
  }
  console.log(`New action log length: ${actionLog.length}`);
});

app.ws('/updates/:session', (ws, req) => {
  console.log('new update listener');
  clients.push({ ws, session: req.params.session });
  ws.on('close', () => {
    console.log('update listener disconnected');
    clients = clients.filter(c => c.ws !== ws);
  });
});

app.listen(3001, () => console.log('Ekofe server listening on port 3001!'));
