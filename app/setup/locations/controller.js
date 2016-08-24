import Ember from 'ember';

export default Ember.Controller.extend({
  setup: Ember.inject.controller(),
  remoteOnly: false,
  addNewLocation() {
    let { schemaDocument, schema, locationProperty } = this.getProperties('schemaDocument', 'schema', 'locationProperty');
    let newLocation = schemaDocument.addItem();

    this.get('setup').setProperties({ newLocation, schema, schemaDocument,
                                      locationProperty });
  },

  locations: Ember.computed('schemaDocument', function() {
    return this.get('schemaDocument.values');
  }),

  validLocations: Ember.computed('locations.[]', function() {
    let locationProperty = this.get('locationProperty');
    return this.get('locations').filter((location) => {
      return locationProperty.isValid(location.values);
    });
  }),

  requiresLocations: Ember.computed.not('remoteOnly'),
  hasNoLocations: Ember.computed.equal('validLocations.length', 0),
  showErrorMessage: Ember.computed.and('requiresLocations', 'hasNoLocations'),

  preventContinueMessage: Ember.computed('showErrorMessage', function() {
    if(this.get('showErrorMessage')) {
      return 'You must add at least one location before proceeding to the next step';
    }
  })
});
