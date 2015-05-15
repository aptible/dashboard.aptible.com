import HalAdapter from "ember-data-hal-9000/adapter";
import DS from "ember-data";
import Ember from "ember";
import config from "../config/environment";
import LookupMethodsWithRequestTypesMixin from "../mixins/adapters/-lookup-methods-with-request-types";

export var auth = {};

export default HalAdapter.extend(LookupMethodsWithRequestTypesMixin, {

  host: config.apiBaseUri,

  headers: function(){
    if (!auth.token) {
      return {};
    }
    return {
      'Authorization': 'Bearer ' + auth.token
    };
  }.property().volatile(),

  pathForType: function(type){
    if (type === 'stack') {
      type = 'account';
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