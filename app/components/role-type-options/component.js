import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    updateType(roleType) {
      this.get('role').set('type', roleType);
    }
  }
});
