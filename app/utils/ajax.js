import Ember from "ember";
import config from "../config/environment";

export default function(url, options){
  if (config.environment === "test") {
    url = url.replace(new RegExp('[^/]*(//)?[^/]*/'), '/');
  }
  return new Ember.RSVP.Promise(function(resolve, reject){
    options.dataType = 'json';
    options.success = resolve;
    options.error = reject;
    options.crossDomain = true;
    options.contentType = 'application/json';
    options.data = JSON.stringify(options.data);
    Ember.$.ajax(url, options);
  });
}
