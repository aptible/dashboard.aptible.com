import Ember from 'ember';

export default Ember.Controller.extend({
  inService: Ember.computed('model.[]', 'app.hasBeenDeployed', function() {
    return this.get('app.hasBeenDeployed') && this.get('model.length');
  })
});
