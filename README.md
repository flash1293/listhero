<img src="">
<h1 align="center">
  <img src="https://raw.githubusercontent.com/flash1293/ekofe/master/client/src/svg/logo.svg" alt="ekofe" title="ekofe" width="300"><br />
  Ekofe
</h1>

<img src="https://travis-ci.org/flash1293/ekofe.svg?branch=master" alt="build:passed">

* 🔒 End-to-end encrypted
* 🔗 Robustly synced across all your devices
* 📱 / 💻 / 🖥️ Use everywhere

ekofe is a small, simple shopping-list app which syncs lists between multiple devices. It uses react, service workers, and material-ui.
You can try (and use) it on [listhero.de](https://listhero.de).

The data is encrypted on the client and synced using a small node.js application server which saves the encrypted changes in a redis instance.

## Development

To start the server and client locally, you need a local redis server. Run `yarn install` and afterwards `yarn start` in the `client`-directory and the `server`-directory.

## Deployment

The easiest way to deploy an ekofe instance is using the prepared `docker-compose.yml` file. On a production system, you can use the built images `flash1293/ekofe-server` and `flash1293/ekofe-client` instead of lokal sources and Dockerfiles.