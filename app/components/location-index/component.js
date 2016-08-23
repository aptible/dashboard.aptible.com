import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['locations-index'],

  actions: {
    removeLocation(location) {
      let message = `About to remove ${location.values.description} Location. Are you sure?`;
      if(confirm(message)) {
        this.sendAction('removeLocation', location);
      }
    },

    onAddLocation() {
      this.sendAction('onAddLocation');
    }
  }
});
