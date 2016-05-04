import Ember from 'ember';

export default Ember.Controller.extend({
  setup: Ember.inject.controller(),

  addNewLocation() {
    let { document, schema, locationProperty } = this.getProperties('document', 'schema', 'locationProperty');
    let newLocation = document.addItem();

    this.get('setup').setProperties({ newLocation, schema, document,
                                      locationProperty });
  },

  locations: Ember.computed('document', function() {
    return this.get('document.values');
  }),

  validLocations: Ember.computed('locations.[]', function() {
    let locationProperty = this.get('locationProperty');
    return this.get('locations').filter((location) => {
      return locationProperty.isValid(location.values);
    });
  }),

  preventContinueMessage: Ember.computed('validLocations.[]', function() {
    if(!this.get('validLocations.length')) {
      return 'You must add at least one location before proceeding to the next step';
    }

    return null;
  })
});
