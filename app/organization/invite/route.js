import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Route.extend({
  queryParams: {
    role: {
      replace: true
    }
  },

  model(params, transition){
    let options = {};
    if (transition.queryParams.role) {
      options.role = transition.queryParams.role;
    }
    options.organization = this.modelFor('organization');
    return this.store.createRecord('invitation', options);
  },

  afterModel(){
    return this.modelFor('organization').get('roles');
  },

  setupController(controller, model){
    controller.set('model', model);
    controller.set('organization', this.modelFor('organization'));
  },

  resetController(controller){
    controller.set('success', null);
  },

  actions: {
    willTransition(){
      this.currentModel.rollback();
    },

    invite(){
      let invitation = this.controller.get('model');

      this.controller.set('success', null);
      invitation.save().then( () => {
        this.controller.set('success', true);

        let newInvite = this.store.createRecord('invitation');
        this.controller.set('model', newInvite);
      }).catch((e) => {
        if (e instanceof DS.InvalidError) {
          // no-op, will be displayed in template
        } else {
          throw e;
        }
      });
    },

    cancel() {
      this.transitionTo('organization.members');
    }
  }
});
