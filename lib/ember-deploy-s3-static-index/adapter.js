'use strict';

/*
 * Borrowed heavily from https://github.com/Kerry350/ember-deploy-s3-index
 * See lib/s3-adapter.js
 */

var CoreObject = require('core-object');
var Promise = require('ember-cli/lib/ext/promise');
var SilentError = require('ember-cli/lib/errors/silent');
var AWS = require('aws-sdk');
var zlib = require('zlib');

module.exports = CoreObject.extend({
  init: function() {
    CoreObject.prototype.init.apply(this, arguments);

    if (!this.config) {
      throw new SilentError('You must supply a config');
    }

    this.client = this.S3 || new AWS.S3(this.config);
  },

  /* Public methods */

  upload: function(buffer) {
    return this._upload(buffer, 'index.html');
  },

  activate: function(revision) {
    // Don't need to support list() or activate()
  },

  list: function() {
    // Don't need to support list() or activate()
  },

  /* Private methods */

  _getUploadParams: function(key, value) {
    return {
      ACL: this.config.acl || 'public-read',
      Bucket: this.config.bucket,
      Key: key,
      Body: zlib.gzipSync(value, { level: zlib.Z_BEST_COMPRESSION }),
      ContentType: 'text/html',
      CacheControl: 'max-age=0, no-cache',
      ContentEncoding: 'gzip'
    }
  },

  _upload: function(buffer, key) {
    return new Promise(function(resolve, reject) {
      var params = this._getUploadParams(key, buffer);
      this.client.putObject(params, function(err, data) {
        if (err) {
          this._logUploadError(reject, err);
        } else {
          this._logUploadSuccess(resolve);
        }
      }.bind(this));
    }.bind(this));
  },

  _logUploadError: function(reject, error) {
    var errorMessage = 'Unable to sync: ' + error.stack;
    reject(new SilentError(errorMessage));
  },

  _logUploadSuccess: function(resolve) {
    this.ui.writeLine('Index file was successfully uploaded');
    resolve();
  }
});
