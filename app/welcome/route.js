import Ember from 'ember';

export function resetDBData(model){
  Ember.set(model, 'dbType', null);
  Ember.set(model, 'dbVersion', null);
  Ember.set(model, 'initialDiskSize', 10);
  Ember.set(model, 'dbHandle', '');
}

export default Ember.Route.extend({
  beforeModel() {
    if(!this.session.get('isAuthenticated')) {
      this.transitionTo('login');
    }
  },

  model(params){
    return this.store
      .find('organization', params.organization_id)
      .then((organization) => {
          return Ember.RSVP.hash({
            organization: organization,
            databaseImages: this.store.find('database-image')
          });
      })
      .then((model) => {
      if (model.organization) {
        let plan = params.plan || 'development';
        if(plan === 'production') {
          plan = 'platform';
        }

        model.stackHandle = model.organization.get('name').dasherize();
        model.plan = plan;
      }

      resetDBData(model);
      return model;
    });
  },

  afterModel(model) {
    if (!model.organization) {
      this.transitionTo('no-organization');
    }

    this.store.find('billing-detail', model.organization.get('id')).then(() => {
      this.store.findStacksFor(model.organization).then((stacks) => {
        if(stacks.get('length') > 0) {
          this.transitionTo('stacks');
        }
      });
    }).catch(Ember.$.noop);
  }
});
