import Ember from 'ember';
import { locationProperty } from 'sheriff/setup/locations/route';

var description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                   Donec aliquet purus ornare condimentum malesuada.
                   Pellentesque diam mi, fermentum ut sapien eu, vehicula
                   dictum elit. Integer cursus sagittis ullamcorper`;

export default Ember.Component.extend({
  classNames: ['add-location-form'],
  errors: null,

  init() {
    this._super(...arguments);

    let { document, schema } = this.getProperties('document', 'schema');

    this.set('locationProperties', schema.itemProperties);
    this.set('description', description);
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
    },

    outsideClick: Ember.K
  }
});

