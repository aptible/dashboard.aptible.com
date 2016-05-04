import LocationsController from 'diesel/setup/locations/controller';
import Ember from 'ember';

export default LocationsController.extend({
  settings: Ember.inject.controller('compliance-settings'),

  addNewLocation() {
    let { document, schema, locationProperty } = this.getProperties('document', 'schema', 'locationProperty');
    let newLocation = document.addItem();

    this.get('settings').setProperties({ newLocation, schema, document,
                                      locationProperty });
  }
});
