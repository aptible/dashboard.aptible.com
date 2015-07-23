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
* `brew install watchman`
* `npm install -g ember-cli`
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

#### Custom website

An addon is used to create new websites on top of S3 bucket with website hosting, CloudFront, and Route53 via a CloudFormation template.

To create a new website use the following command:

```
ember create-website --domain=aptible-staging.com --subdomain=dashboard-rwjblue
```

To build and deploy to this newly created bucket, use the following command:

```bash
AWS_BUCKET=dashboard-rwjblue.aptible-staging.com ember deploy --environment staging
```

#### Continuous Deployment

The `master` branch of this repo is deployed to [dashboard.aptible-staging.com](http://dashboard.aptible-staging.com/) upon a successful build.

The `release` branch of this repo is deployed to [dashboard.aptible.com](https://dashboard.aptible.com/) upon a successful build.

#### Production Release

To trigger CI to deploy a new version to production, run the following command:

```bash
ember release
```

This does the following steps automatically:

* Update `package.json` version
* Commit the `package.json` changes
* Tag the next version. This automatically selects a patch level version bump. To bump the minor version you can run `ember release --minor` (same with major).
* Push tag and `package.json` changes to master.
* Push master to release (this triggers CI to do a production deployment).

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
