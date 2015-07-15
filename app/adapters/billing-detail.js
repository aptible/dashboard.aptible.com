import config from "../config/environment";
import ApplicationAdapter from "./application";
import Ember from "ember";
import Inflector from 'ember-inflector';

export default ApplicationAdapter.extend({
  host: config.billingBaseUri,

  pathForType: function(type) {
    const underscored = Ember.String.underscore(type);
    return Inflector.inflector.pluralize(underscored);
  }
});
