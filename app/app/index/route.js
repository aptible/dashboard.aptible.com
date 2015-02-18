import Ember from 'ember';

export default Ember.Route.extend({
  redirect: function(){
    let app = this.modelFor('app');

    if (app.get('hasBeenDeployed')) {
      this.replaceWith('app.services');
    } else {
      this.replaceWith('app.deploy');
    }
  }
});
