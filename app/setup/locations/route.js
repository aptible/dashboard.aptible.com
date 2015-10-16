import Ember from 'ember';
import Schema from 'ember-json-schema/models/schema';
import locationsSchema from 'sheriff/schemas/locations';

export default Ember.Route.extend({
  model() {
    this._schema = new Schema(locationsSchema);
    return this._schema.buildDocument();
  },

  setupController(controller, model) {
    let properties = this._schema.itemProperties;

    controller.set('model', model);
    controller.set('locationProperties', properties);
  },

  actions: {
    addLocation(locationData) {
      let locations = this.currentModel;
      this.controller.notifyPropertyChange('locations');
    }
  }
});
