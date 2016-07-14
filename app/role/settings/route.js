import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    save() {
      let role = this.currentModel;
      if (role.get('isDirty')) {
        role.save().catch((e) => {
          // Silence invalidation errors
          if (!(e instanceof DS.InvalidError)) {
            throw e;
          }
        }).then(() => {
          let role = this.currentModel;
          let message = `${role.get('name')} saved`;

          Ember.get(this, 'flashMessages').success(message);
          this.transitionTo('role.members');
        });
      }
    }
  }
});
