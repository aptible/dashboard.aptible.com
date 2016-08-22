import LocationsController from 'diesel/setup/locations/controller';
import Ember from 'ember';

export default LocationsController.extend({
  settings: Ember.inject.controller('compliance-settings'),

  addNewLocation() {
    let { schemaDocument, schema, locationProperty } = this.getProperties('schemaDocument', 'schema', 'locationProperty');
    let newLocation = schemaDocument.addItem();

    this.get('settings').setProperties({ newLocation, schema, schemaDocument,
                                      locationProperty });
  }
});
