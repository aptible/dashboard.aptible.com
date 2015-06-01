import HalAdapter from "ember-data-hal-9000/adapter";
import DS from "ember-data";
import Ember from "ember";
import config from "../config/environment";

export var auth = {};

export default HalAdapter.extend({
  host: config.apiBaseUri,

  headers: Ember.computed(function(){
    if (!auth.token) {
      return {};
    }
    return {
      'Authorization': 'Bearer ' + auth.token
    };
  }).volatile(),

  pathForType: function(type){
    if (type === 'stack') {
      type = 'account';
    }

    if(type === 'criterion') {
      return 'criteria';
    }

    return this._super(type);
  },

  ajaxError: function(jqXHR){
    var error = this._super(jqXHR);
    if (jqXHR && jqXHR.status === 422) {
      var payload = Ember.$.parseJSON(jqXHR.responseText);
      return new DS.InvalidError({
        message: payload.message
      });
    } else {
      return error;
    }
  }
});
