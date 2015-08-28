import Ember from 'ember';
import Changeset from "diesel/utils/changeset";

export default Ember.Route.extend({
  model(params){
    return this.store.find('user', params.user_id);
  },

  afterModel(model) {
    return Ember.RSVP.hash({
      roles: model.get('roles'),
      securityOfficer: this.modelFor('organization').get('securityOfficer')
    });
  },

  setupController(controller, model){
    controller.set('model', model);
    controller.set('organization', this.modelFor('organization'));

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
      let organization = this.modelFor('organization');

      user.set('organizationId', organization.get('id'));
      user.destroyRecord().then(() => {
        let message = `${user.get('name')} removed from ${organization.get('name')}`;

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
