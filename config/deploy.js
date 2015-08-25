var SilentError = require('silent-error');
var detectEndpointUri = require('../lib/detect-endpoint-uri');

function optionsFor(environment, type) {
  var accessKeyId = process.env['AWS_ACCESS_KEY_ID'];
  var secretAccessKey = process.env['AWS_SECRET_ACCESS_KEY'];
  var bucket = detectEndpointUri('dashboard', environment, '');

  if (!bucket) {
    throw new SilentError('No bucket was found for ' + environment);
  }

  if (!accessKeyId) {
    throw new SilentError('AWS_ACCESS_KEY_ID was not found in `process.env`. Aborting.');
  }

  if (!secretAccessKey) {
    throw new SilentError('AWS_SECRET_ACCESS_KEY was not found in `process.env`. Aborting.');
  }

  return {
    type: type,
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
    acl: 'public-read',
    bucket: bucket
  };
}

var options = {};
var environments = ['production', 'staging', 'sandbox'];

environments.forEach(function(environment) {
  options[environment] = {
    buildEnv: environment,

    store: optionsFor(environment, 's3-static'),
    assets: optionsFor(environment, 's3')
  };
});

module.exports = options;
