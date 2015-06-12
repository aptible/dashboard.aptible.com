# ![Aptible](http://aptible-media-assets-manual.s3.amazonaws.com/tiny-github-icon.png) dashboard.aptible.com

[![Build Status](https://travis-ci.org/aptible/dashboard.aptible.com.svg?branch=master)](https://travis-ci.org/aptible/dashboard.aptible.com) [![Stories in Ready](https://badge.waffle.io/aptible/dashboard.aptible.com.svg?label=ready&title=Ready)](http://waffle.io/aptible/dashboard.aptible.com)

Aptible's customer dashboard (aka **Diesel**). It allows users to manage organizations, access controls, and ops.

The NPM package and internal project name for this Ember app is `diesel`.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM) and [Bower](http://bower.io/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit localhost:4200

By default, the api.aptible.com and auth.aptible.com servers will be used as data sources. For use with Dashboard they should be given the `.env` values of:

```
CORS_DOMAIN="http://localhost:4200"
```

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

The `master` branch of this repo is deployed to [dashboard.aptible-staging.com](http://dashboard.aptible-staging.com/) upon a successful build.

The `release` branch of this repo is deployed to [dashboard.aptible.com](https://dashboard.aptible.com/) upon a successful build.

### Deploying via CI

This repo contains a `.travis.yml` file that will automatically deploy the application to staging/production. To do this, our AWS credentials are encrypted and stored on Travis. To update these credentials, run the following command (inserting the credential values):

    travis encrypt -r aptible/dashboard.aptible.com --add env AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=...

The `.travis.yml` file will be updated with a new value for `env.secure`. Commit and push this file.

## Further Reading / Useful Links

* ember: http://emberjs.com/
* ember-cli: http://www.ember-cli.com/
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

## Copyright

Copyright (c) 2015 [Aptible](https://www.aptible.com). All rights reserved.

[<img src="https://s.gravatar.com/avatar/9b58236204e844e3181e43e05ddb0809?s=60" style="border-radius: 50%;" alt="@sandersonet" />](https://github.com/sandersonet)
