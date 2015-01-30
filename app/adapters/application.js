import HalAdapter from "ember-data-hal-9000/adapter";
import DS from "ember-data";
import Ember from "ember";
import config from "../config/environment";

export var auth = {};

export default HalAdapter.extend({

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
  },

  deleteRecord: function(store, type, record){
    var id = Ember.get(record, 'id');
    var url = this.buildURL(type.typeKey, id);
    return this.ajax(url, "DELETE");
  },

  find: function(store, type, id /*, record */) {
    return this.ajax(this.buildURL(type.typeKey, id), 'GET');
  }

});
