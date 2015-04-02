import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Route.extend({
  afterModel(model) {
    return Ember.RSVP.all([
      model.get('users'),
      model.get('securityOfficer'),
      model.get('billingContact')
    ]);
  },

  deactivate() {
    this.controller.set('error', null);
  },

  actions: {
    save(model) {
      model.save().then(() => {
        this.transitionTo('organization', model);
      }, (e) => {
        if (e instanceof DS.InvalidError) {
          // no-op, will be displayed in template
        } else {
          throw e;
        }
      });
    }
  }
});
