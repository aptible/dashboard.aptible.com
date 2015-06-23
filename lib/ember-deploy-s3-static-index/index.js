'use strict';

var Adapter = require('./adapter');

module.exports = {
  name: 'ember-deploy-s3-static-index',
  type: 'ember-deploy-addon',

  adapters: {
    index: {
      's3-static': Adapter
    }
  }
};
