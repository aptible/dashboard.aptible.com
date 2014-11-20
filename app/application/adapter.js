import config from "../config/environment";
import HalAdapter from "ember-data-hal-9000/adapter";

export var auth = {};

export default HalAdapter.extend({
  host: config.apiBaseUri,
  headers: function(){
    return {
      'Authorization': 'Bearer ' + auth.token
    };
  }.property().volatile(),
  pathForType: function(type){
    if (type === 'stack') {
      type = 'account';
    }
    return this._super(type);
  }
});
