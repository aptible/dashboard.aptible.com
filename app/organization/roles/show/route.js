import Changeset from "diesel/utils/changeset";
import Ember from 'ember';
import DS from 'ember-data';

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

    const promises = [];

    // Find only the stacks that belong to the
    // current organization
    promises.push(this.store.findStacksFor(this._organization).then((stacks) => {
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
        let message = `${user.get('name')} added to ${role.get('name')} role`;
        Ember.get(this, 'flashMessages').success(message);
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
        let message = `${user.get('name')} removed from ${role.get('name')} role`;
        Ember.get(this, 'flashMessages').success(message);
        return this.currentModel.get('users').reload();
      });
    },

    inviteByEmail(email){
      let role = this.currentModel;
      let invitation = this.controller.get('invitation');
      if (invitation) {
        invitation.set('email', email);
      } else {
        invitation = this.store.createRecord('invitation', {
          email,
          role
        });
        this.controller.set('invitation', invitation);
      }
      invitation.save().then(() => {
        this.controller.set('invitation', null);
        let message = `Invitation sent to ${email}`;
        Ember.get(this, 'flashMessages').success(message);
      }, (e) => {
        if (!(e instanceof DS.InvalidError)) {
          throw e;
        }
      });
    },

    removeInvitation(invitation){
      invitation.destroyRecord().then(() => {
        let message = `Invitation to ${invitation.get('email')} destroyed`;
        Ember.get(this, 'flashMessages').success(message);
      });
    },

    resendInvitation(invitation){
      let reset = this.store.createRecord('reset');
      reset.setProperties({
        type: 'invitation',
        invitationId: invitation.get('id')
      });
      reset.save().then(() => {
        let message = `Invitation resent to ${invitation.get('email')}`;
        Ember.get(this, 'flashMessages').success(message);
      });
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

      let saveSuccessful = true;

      if (this.currentModel.get('isDirty')) {
        savePromises.push(this.currentModel.save().catch((e) => {
          saveSuccessful = false;
          // Silence invalidation errors
          if (!(e instanceof DS.InvalidError)) {
            throw e;
          }
        }));
      }

      return Ember.RSVP.all(savePromises).then(() => {
        if (saveSuccessful) {
          let role = this.currentModel;
          let message = `${role.get('name')} saved`;

          Ember.get(this, 'flashMessages').success(message);
          this.transitionTo('organization.roles');
        }
      });
    }
  }
});
