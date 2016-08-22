import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['add-location-form'],
  errors: null,

  init() {
    this._super(...arguments);

    let { schema } = this.getProperties('schema');

    this.set('locationProperties', schema.itemProperties);
  },

  actions: {
    clearMessages() {
      this.set('errors', null);
    },

    onDismiss() {
      let { newLocation, schemaDocument } = this.getProperties('newLocation', 'schemaDocument');

      schemaDocument.removeObject(newLocation);

      this.set('errors', null);
      this.sendAction('dismiss');
    },

    addLocation() {
      this.set('errors', null);
      let { newLocation, schemaDocument, locationProperty } = this.getProperties('newLocation', 'schemaDocument', 'locationProperty');

      if(!locationProperty.isValid(newLocation.values)) {
        this.set('errors', `Error: ${locationProperty.required.join(', ')} are required fields`);
        return;
      }

      this.sendAction('onLocationCreated', newLocation);

      Ember.run.later(() => {
        this.set('newLocation', schemaDocument.addItem());
        this.sendAction('dismiss');
      });
    },

    outsideClick: Ember.K
  }
});

