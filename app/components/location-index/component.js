import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['locations-index'],

  actions: {
    removeLocation(location) {
      this.sendAction('removeLocation', location);
    }
  }
});
