import Changeset from 'diesel/utils/changeset';
import Ember from 'ember';

export default Ember.Route.extend({
  init() {
    this._super();
    this._stacks = null;
    this._organization = null;
  },
  model(params) {
    return this.store.find('role', params.role_id);
  },
  afterModel(model) {
    this._organization = this.modelFor('organization');
    const organizationUrl = this._organization.get('data.links.self');

    const promises = [];

    // Find only the stacks that belong to the
    // current organization
    promises.push(this.store.find('stack').then(() => {
      return this.store.filter('stack', (stack) => {
        return stack.get('data.links.organization') === organizationUrl;
      });
    }).then((stacks) => {
      this._stacks = stacks;
    }));

    promises.push(this._organization.get('users'));
    promises.push(model.get('users'));
    promises.push(model.get('invitations'));

    return Ember.RSVP.all(promises);
  },
  setupController(controller, model) {
    controller.set('model', model);
    controller.set('stacks', this._stacks);
    controller.set('organization', this._organization);

    const changeset = Changeset.create({
      key(keyData) {
        return `${keyData.stack.get('handle')}-${keyData.scope}`;
      },
      initialValue(keyData) {
        const permissions = keyData.stack.get('permissions.content');
        const role = keyData.role;
        const scope = keyData.scope;

        const value = {};

        value.permission = permissions.find((perm) => {
          let roleLink = role.get('data.links.self');
          let permRoleLink = perm.get('data.links.role');
          return roleLink === permRoleLink &&
            perm.get('scope') === scope;
        });
        value.isEnabled = !!value.permission;

        return value;
      }
    });
    controller.set('changeset', changeset);
    controller.observeChangeset();
  },
  actions: {
    inviteUser(user){
      const role = this.currentModel;
      const userLink = user.get('data.links.self');
      const membership = this.store.createRecord('membership', {
        role,
        userUrl: userLink
      });
      membership.save().then(() => {
        return this.currentModel.get('users').reload();
      });
    },
    removeUser(user){
      let role = this.currentModel;
      let userLink = user.get('data.links.self');

      role.get('memberships').then((memberships) => {
        let membership = memberships.findBy('data.links.user', userLink);
        return membership.destroyRecord();
      }).then(() => {
        return this.currentModel.get('users').reload();
      });
    },
    inviteByEmail(email){
      let role = this.currentModel;
      let invitation = this.store.createRecord('invitation', {
        email,
        role
      });
      invitation.save();
    },
    removeInvitation(invitation){
      invitation.destroyRecord();
    },
    resendInvitation(invitation){
      let reset = this.store.createRecord('reset');
      reset.setProperties({
        type: 'invitation',
        invitationId: invitation.get('id')
      });
      reset.save();
    },

    cancel() {
      this.transitionTo('organization.roles');
    },

    save() {

      const savePromises = [];
      const changeset = this.controller.get('changeset');

      changeset.forEachValue((keyData, initialValue, value) => {
        if (initialValue === value) { return; }

        let promise;
        if (value.isEnabled) {
          promise = this.store.createRecord('permission', {
            role:  keyData.role.get('data.links.self'),
            scope: keyData.scope,
            stack: keyData.stack
          }).save();
        } else {
          promise = value.permission.destroyRecord();
        }

        savePromises.push(promise);
      });

      if (this.currentModel.get('isDirty')) {
        savePromises.push(this.currentModel.save());
      }

      return Ember.RSVP.all(savePromises).then(() => {
        this.transitionTo('organization.roles');
      });
    }
  }
});
