import Ember from 'ember';

export default Ember.Route.extend({
  activate() {
    // Once 
    Ember.run.later(() => {
      Ember.$(".initial-loading-indicator").remove();
    });
  }
});
