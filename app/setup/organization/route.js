import Ember from 'ember';
import SPDRouteMixin from 'diesel/mixins/routes/spd-route';

export default Ember.Route.extend(SPDRouteMixin, {
  model() {
    return this.modelFor('setup');
  },

  actions: {
    onSave() {
      let profile = this.modelFor('setup');
      profile.save().then(() => {
        let message = 'Progress saved.';
        Ember.get(this, 'flashMessages').success(message);
      }, (e) => {
        let message = Ember.getWithDefault(e, 'responseJSON.message', 'An error occured');
        Ember.get(this, 'flashMessages').danger(`Save Failed! ${message}`);
      });
    }
  }
});
