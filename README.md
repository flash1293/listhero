<h1 align="center">
  <img src="https://raw.githubusercontent.com/flash1293/ekofe/master/logo.png" alt="ekofe" title="ekofe" width="100" /><br />
  Ekofe
</h1>

<img src="https://travis-ci.org/flash1293/ekofe.svg?branch=master" alt="build:passed">

* 🔒 End-to-end encrypted
* 🔗 Robustly synced across all your devices
* 📱 / 💻 / 🖥️ Use everywhere

ekofe is a small, simple shopping-list app which syncs lists between multiple devices. It uses react, service workers, and material-ui.
You can try (and use) it on [listhero.de](https://listhero.de).

The data is encrypted on the client and synced using a small node.js application server which saves the encrypted changes in a connected postgres instance.

## Development

To start the server and client locally, you need a local redis server. Run `yarn install` and afterwards `yarn dev` in the `client`-directory and the `server`-directory.

### Setting up a local db

(for Mac)

* `brew install postgres`
* `pg_ctl -D /usr/local/var/postgres start`
* `createdb ekofe`

## Deployment

The easiest way to deploy an ekofe instance is using the prepared `docker-compose.yml` file. On a production system, you can use the built images `flash1293/ekofe-server` and `flash1293/ekofe-client` instead of local sources and Dockerfiles.

## Mechanism

This app uses redux under the hood and syncs not the app state itself, but the individual actions between various clients connected to the same account. More explanation in the [presentation](https://docs.google.com/presentation/d/1WtJjzC9rBdzH84J0rLnWLK6Mtjt5sIRVVy6Jom2M-h0/edit?usp=sharing)
