import Ember from 'ember';
import { locationProperty } from 'sheriff/setup/locations/route';

export default Ember.Component.extend({
  classNames: ['add-location-form'],
  errors: null,

  init() {
    this._super(...arguments);

    let { document, schema } = this.getProperties('document', 'schema');

    this.set('locationProperties', schema.itemProperties);
  },

  actions: {
    clearMessages() {
      this.set('errors', null);
    },

    onDismiss() {
      let { newLocation, document } = this.getProperties('newLocation', 'document');
      let currentLocation = this.get('newLocation');

      document.removeObject(currentLocation);

      this.set('errors', null);
      this.sendAction('dismiss');
    },

    addLocation() {
      this.set('errors', null);
      let { newLocation, document } = this.getProperties('newLocation', 'document');

      if(!locationProperty.isValid(newLocation.values)) {
        this.set('errors', `Error: ${locationProperty.required.join(', ')} are required fields`);
        return;
      }

      this.sendAction('action', newLocation);

      Ember.run.later(() => {
        this.set('newLocation', document.addItem());
        this.sendAction('dismiss');
      });
    }
  }
});

