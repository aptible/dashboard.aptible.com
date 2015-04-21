import Ember from 'ember';

export function resetDBData(model){
  Ember.set(model, 'dbType', null);
  Ember.set(model, 'initialDiskSize', 10);
  Ember.set(model, 'dbHandle', '');
}

export default Ember.Route.extend({
  queryParams: {
    plan: { }
  },
  beforeModel: function(){
    if(this.session.get('isAuthenticated')) {
      return this.store.find('stack').then((stacks) => {
        if (stacks.get('length') !== 0) {
          this.transitionTo('index');
        }
      });
    } else {
      this.transitionTo('login');
    }
  },

  model: function(params){
    return this.store.find('organization').then((organizations) => {
      let stackHandle = organizations.objectAt(0).get('name').dasherize();
      let plan = params.plan || 'development';

      if(plan === 'production') {
        plan = 'platform';
      }

      let model = {
        stackHandle,
        plan
      };
      resetDBData(model);
      return model;
    });
  }
});
