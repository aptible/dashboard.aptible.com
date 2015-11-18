import Ember from 'ember';
import { locationProperty } from 'sheriff/setup/locations/route';

export default Ember.Component.extend({
  classNames: ['add-location-form'],
  errors: null,

  init() {
    this._super(...arguments);

    let { document, schema } = this.getProperties('document', 'schema');
    let newLocation = document.addItem();

    this.set('location', newLocation);
    this.set('locationProperties', schema.itemProperties);
  },

  actions: {
    clearMessages() {
      this.set('errors', null);
    },

    addLocation() {
      this.set('errors', null);
      let { location, document } = this.getProperties('location', 'document');

      if(!locationProperty.isValid(location.values)) {
        this.set('errors', `Error: ${locationProperty.required.join(', ')} are required fields`);
        return;
      }

      this.sendAction('action', location);

      Ember.run.later(() => {
        this.set('location', document.addItem());
        this.rerender();
      });
    }
  }
});

