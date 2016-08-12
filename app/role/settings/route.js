import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    save() {
      let role = this.currentModel;
      if (role.get('isDirty')) {
        role.save().then(() => {
          let message = `${role.get('name')} saved`;

          Ember.get(this, 'flashMessages').success(message);
          this.transitionTo('role.members');
        });
      }
    }
  }
});
