import ApplicationAdapter from "./application";
import Ember from "ember";

export var auth = {};

export default ApplicationAdapter.extend({

  buildURL: function(){
    var url = [],
        host = Ember.get(this, 'host'),
        prefix = this.urlPrefix();

    if (prefix) { url.unshift(prefix); }

    url.unshift('password', 'resets', 'new');

    url = url.join('/');
    if (!host && url) { url = '/' + url; }

    return url;
  }

});
