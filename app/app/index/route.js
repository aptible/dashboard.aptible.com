import Ember from 'ember';

export default Ember.Route.extend({
  redirect: function(){
    let app = this.modelFor('app');

    if (app.get('hasBeenDeployed')) {
      this.transitionTo('app.services');
    } else {
      this.transitionTo('app.deploy');
    }
  }
});
