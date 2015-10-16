import Ember from 'ember';

export default Ember.Component.extend({
  setup: function() {
    let document = this.get('document');
    let newLocation = document.addItem();
    this.set('location', newLocation);
  }.on('didInsertElement'),

  values: {
    description: "Home",
    streetAddress: "8544 Preservation Way",
    city: "Indianapolis",
    state: "Indiana",
    zip: "46278"
  },

  classNames: ['add-location-form'],
  actions: {
    addLocation() {
      let location = this.get('location');
      let values = this.get('values');
      let document = this.get('document');

      for(let key in values) {
        location.set(key, values[key]);
      }

      this.sendAction('action', location);

      Ember.run.later(() => {
        this.set('location', document.addItem());
        this.set('values', {});
      });
    }
  }
});
