import AuthAdapter from "./auth";
import Ember from "ember";

export var auth = {};

export default AuthAdapter.extend({

  buildURL: function(){
    var url = [],
        host = Ember.get(this, 'host'),
        prefix = this.urlPrefix();

    if (prefix) { url.push(prefix); }

    url.push('password/resets/new');

    url = url.join('/');
    if (!host && url) { url = '/' + url; }

    return url;
  }

});
