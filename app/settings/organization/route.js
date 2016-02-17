import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('settings');
  },
  actions: {
    save() {
      this.currentModel.save();
    }
  }
});
