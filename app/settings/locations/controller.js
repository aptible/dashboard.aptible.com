import LocationsController from 'sheriff/setup/locations/controller';
import Ember from 'ember';

export default LocationsController.extend({
  settings: Ember.inject.controller(),

  addNewLocation() {
    let { document, schema, locationProperty } = this.getProperties('document', 'schema', 'locationProperty');
    let newLocation = document.addItem();

    this.get('settings').setProperties({ newLocation, schema, document,
                                      locationProperty });
  }
});
