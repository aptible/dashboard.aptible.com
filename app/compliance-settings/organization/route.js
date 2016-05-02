import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('compliance-settings');
  },
  actions: {
    save() {
      this.currentModel.save().then(() => {
        let message = 'Organization profile saved.';
        Ember.get(this, 'flashMessages').success(message);
      }, (e) => {
        let message = Ember.getWithDefault(e, 'responseJSON.message', 'An error occured');
        Ember.get(this, 'flashMessages').danger(`Save Failed! ${message}`);
      });
    }
  }
});
