import Ember from 'ember';
import Schema from 'ember-json-schema/models/schema';
import Property from 'ember-json-schema/models/property';
import locationsSchema from 'sheriff/schemas/locations';

// Use schema as property for validation
export var locationProperty = new Property(locationsSchema.items);

export default Ember.Route.extend({
  model() {
    this._schema = new Schema(locationsSchema);
    return this._schema.buildDocument();
  },

  setupController(controller, model) {
    controller.set('model', model);
    controller.set('locationSchema', this._schema);
  },

  actions: {
    continue() {

    }
  }
});
