import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Route.extend({
  queryParams: {
    role: {
      replace: true
    }
  },

  model(params, transition){
    let organization = this.modelFor('organization');
    let options = { organization };
    if (transition.queryParams.role) {
      options.role = transition.queryParams.role;
    }

    return this.store.createRecord('invitation', options);
  },

  afterModel(){
    return this.modelFor('organization').get('roles');
  },

  setupController(controller, model) {
    let organization = this.modelFor('organization');

    if(!model.get('role.id')) {
      model.set('role', organization.get('roles.firstObject'));
    }

    controller.set('model', model);
    controller.set('organization', organization);
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
        this.transitionTo('organization.members.pending-invitations');
        let successMessage = `Invitation sent to ${invitation.get('email')}`;
        Ember.get(this, 'flashMessages').success(successMessage);
      }).catch((e) => {
        if (e instanceof DS.InvalidError) {
          // no-op, will be displayed in template
        } else {
          throw e;
        }
      });
    },

    cancel() {
      this.transitionTo('organization.members.index');
    }
  }
});
