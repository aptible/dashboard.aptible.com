import Ember from 'ember';
var description = `A remote workforce may expose you to increased risk. Use the
                  form below to add a new workforce location.`;

export default Ember.Component.extend({
  classNames: ['add-location-form'],
  errors: null,

  init() {
    this._super(...arguments);

    let { schema } = this.getProperties('schema');

    this.set('locationProperties', schema.itemProperties);
    this.set('description', description);
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

