import Ember from 'ember';
import Changeset from "diesel/utils/changeset";

export default Ember.Route.extend({
  model(params){
    let context = this.modelFor('organization');
    return context.get('users').findBy('id', params.user_id);
  },

  setupController(controller, model){
    let context = this.modelFor('organization');
    controller.set('model', model);
    controller.set('context', context);

    let changeset = Changeset.create({
      key(keyData) {
        return keyData.organizationRole.get('id');
      },
      initialValue(keyData) {
        const user = keyData.user;
        const organizationRole = keyData.organizationRole;
        return user.get('roles').contains(organizationRole);
      }
    });
    controller.set('changeset', changeset);
  },

  actions: {
    cancel() {
      this.transitionTo('organization.members');
    },

    remove(user){
      let context = this.modelFor('organization');
      let { organization, billingDetail } = context.getProperties('organization', 'billingDetail');
      let message = `${user.get('name')} removed from ${organization.get('name')}`;

      if (user.get('id') === organization.get('securityOfficer.id')) {
        message = `${user.get('name')} is ${organization.get('name')}'s Security
                   Officer and cannot be removed until a new one is assigned.`;
        Ember.get(this, 'flashMessages').failure(message);
        return false;
      }

      if (user.get('id') === billingDetail.get('billingContact.id')) {
        message = `${user.get('name')} is ${organization.get('name')}'s Billing
                   Contact and cannot be removed until a new one is assigned.`;
        Ember.get(this, 'flashMessages').failure(message);
        return false;
      }

      user.set('organizationId', organization.get('id'));
      user.destroyRecord().then(() => {
        this.transitionTo('organization.members');
        Ember.get(this, 'flashMessages').success(message);
      });
    },

    save() {
      const promises = [];
      const changeset = this.controller.get('changeset');
      let promise;

      changeset.forEachValue((keyData, initialValue, value) => {
        if (initialValue === value) { return; }

        let user = this.currentModel;
        let userLink = user.get('data.links.self');
        let role     = keyData.organizationRole;

        if (value) {
          promise = this.store.createRecord('membership', {
            userUrl: userLink,
            user,
            role
          }).save().then(function() {
            user.get('roles').addObject(role);
          });
        } else {
          promise = role.get('memberships').then((memberships) => {
            let userMembership = memberships.findBy('data.links.user', userLink);
            Ember.assert(`A user membership could not be found for user id "${user.get('id')}"
                          and role name ${role.get('name')}`,
                         !!userMembership);
            user.get('roles').removeObject(role);
            return userMembership.destroyRecord();
          });
        }

        promises.push(promise);
      });

      Ember.RSVP.all(promises).then(() => {
        let user = this.currentModel;
        let message = `${user.get('name')} updated`;

        Ember.get(this, 'flashMessages').success(message);
        this.transitionTo('organization.members');
      });
    }
  }
});
