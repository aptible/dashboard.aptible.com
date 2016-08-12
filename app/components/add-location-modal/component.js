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
      let { newLocation, document } = this.getProperties('newLocation', 'document');

      document.removeObject(newLocation);

      this.set('errors', null);
      this.sendAction('dismiss');
    },

    addLocation() {
      this.set('errors', null);
      let { newLocation, document, locationProperty } = this.getProperties('newLocation', 'document', 'locationProperty');

      if(!locationProperty.isValid(newLocation.values)) {
        this.set('errors', `Error: ${locationProperty.required.join(', ')} are required fields`);
        return;
      }

      this.sendAction('onLocationCreated', newLocation);

      Ember.run.later(() => {
        this.set('newLocation', document.addItem());
        this.sendAction('dismiss');
      });
    },

    outsideClick: Ember.K
  }
});

