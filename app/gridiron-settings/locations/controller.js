import LocationsController from 'diesel/gridiron-setup/locations/controller';
import Ember from 'ember';

export default LocationsController.extend({
  gridironSettings: Ember.inject.controller(),

  addNewLocation() {
    let { schemaDocument, schema, locationProperty } = this.getProperties('schemaDocument', 'schema', 'locationProperty');
    let newLocation = schemaDocument.addItem();

    this.get('gridironSettings').setProperties({ newLocation, schema, schemaDocument,
                                      locationProperty });
  }
});
