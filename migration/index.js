const fs = require('fs');

const dump = require(process.argv[2])['0'];

console.log(Object.keys(dump));

const users = dump.users;

const dataCollection = [];
Object.entries(users).forEach(([id, user]) => {
    const dataObject = {
        username: id,
        kdf: JSON.parse(user).kdf,
        actions: []
    };

    if (dump[`stream-${id}`]) {
        dataObject.actions = dump[`stream-${id}`];
    }

    if (dump[`snapshot-${id}`]) {
        dataObject.snapshot = dump[`snapshot-${id}`];
    }

    if (dataObject.actions.length)
        console.log(`${id}: ${dataObject.actions.length}, snapshot: ${!!dataObject.snapshot}`);

    dataCollection.push(dataObject);
});

fs.writeFileSync(`${process.argv[2]}.migrated.json`, JSON.stringify(dataCollection));