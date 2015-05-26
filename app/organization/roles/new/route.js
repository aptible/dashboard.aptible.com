import Ember from 'ember';
import Changeset from "diesel/utils/changeset";

export default Ember.Route.extend({
  model(){
    let organization = this.modelFor('organization');
    return this.store.createRecord('role', {
      organization
    });
  },

  afterModel(){
    let organization = this.modelFor('organization');
    return this.store.findStacksFor(organization).then((stacks) => {
      this._stacks = stacks;
    });
  },

  setupController(controller, model){
    this._super(controller, model);
    controller.set('stacks', this._stacks);
    controller.set('organization', this.modelFor('organization'));

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
    //controller.observeChangeset();
  },

  actions: {
    willTransition() {
      this.currentModel.rollback();
    },

    cancel() {
      this.transitionTo('organization.roles');
    },

    save(){
      let role = this.currentModel;
      let changeset = this.controller.get('changeset');

      role.save().then(() => {
        let newPermissions = [];
        changeset.forEachValue((keyData, initialValue, value) => {
          if (value.isEnabled) {
            let permission = this.store.createRecord('permission', {
              stack: keyData.stack,
              role:  keyData.role.get('data.links.self'),
              scope: keyData.scope
            });
            newPermissions.push( permission.save() );
          }
        });

        return Ember.RSVP.all(newPermissions);
      }).then(() => {
        let message = `${role.get('name')} created`;

        this.transitionTo('organization.roles.index');
        Ember.get(this, 'flashMessages').success(message);
      });
    }
  }
});

