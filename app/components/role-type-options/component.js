import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['role-type-options']
  actions: {
    updateType(roleType) {
      this.get('role').set('type', roleType);
    }
  }
});
