import ApplicationAdapter from '../application/adapter';
import Ember from 'ember';

export default ApplicationAdapter.extend({
  buildURL: function(type, id, record) {
    var url = [],
        host = Ember.get(this, 'host'),
        prefix = this.urlPrefix();

    if (type) { // === 'app'

      // if POSTing, should POST to /accounts/1/apps
      // should push 'stack', account_id to url
      var stackId = record ? Ember.get(record, 'stack.id') : null;
      if (stackId) {
        url.push('accounts');
        url.push( stackId );
      }

      // if GETting, should request from /apps/1
      url.push(this.pathForType(type));
    }

    if (prefix) { url.unshift(prefix); }

    url = url.join('/');
    if (!host && url) { url = '/' + url; }

    return url;
  }
});
