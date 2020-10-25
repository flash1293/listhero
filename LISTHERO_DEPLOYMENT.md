# Deployment documentation listhero.de

Ekofe is hosted at listhero.de. This file describes how the deployment is managed
using the free tiers of Netlify and Heroku. Feel free to use a similar setup to host it yourself.


## Backend

* Create app in Heroku
* Add Heroku Postgres addon
* Add `SECRET` environment variable (should be a strong random string)
* Add `SEED` environment variable (should be a strong random string)
* In Github repo:
   * `heroku login`
   * `heroku git:remote -a <APP NAME>`
   * `./deploy_server.sh`

## Frontend

* Fork repo
* Change `REACT_APP_API_HOST` in `heroku` script in `client/package.json` to `<APP NAME>.herokuapp.com`
* Create site in Netlify
* Set up continuous deployment:
   * Repository: `github.com/<your GH username>/listhero`
   * Base directory: `client`
   * Build command: `yarn heroku`
   * Publish directory: `client/build`