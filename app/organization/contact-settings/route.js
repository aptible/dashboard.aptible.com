import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Route.extend({
  model() {
    return this.modelFor('organization');
  },

  setupController(controller, model) {
    controller.set('model', model.get('organization'));
    controller.set('billingDetail', model.get('billingDetail'));
  },

  resetController(controller) {
    controller.set('error', null);
  },

  actions: {
    save(model, billingDetail) {
      model.save().then(() => {
        billingDetail.save().then(() => {
          let message = 'Contact settings saved';
          this.transitionTo('organization.contact-settings', model);
          Ember.get(this, 'flashMessages').success(message);
        });
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
