import AuthAdapter from './auth';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';

export default AuthAdapter.extend({
  buildURL: buildURLWithPrefixMap({
    'organizations': {property: 'organizationId', only:['delete']}
  }),

  ajaxOptions: function(url, type, options) {
    var hash = this._super(url, type, options);

    hash = hash || {};
    hash.xhrFields = hash.xhrFields || {};
    // Allows the cookie set by logging in to be persisted
    // (by the browser). That cookie provides credentials to
    // the dashboard app.
    hash.xhrFields.withCredentials = true;

    return hash;
  }

});

