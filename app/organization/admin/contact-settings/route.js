import Ember from 'ember';

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
      this.controller.set('isSaving', true);

      model.save()
      .then(() => {
        return billingDetail.save();
      })
      .then(() => {
        let message = 'Contact settings saved';
        Ember.get(this, 'flashMessages').success(message);
        this.controller.set('isSaving', false);
      })
      .catch((e) => {
        let message = Ember.get(e, 'responseJSON.message') ||
                      Ember.get(e, 'message') ||
                      `There was an error updating contact settings`;
        Ember.get(this, 'flashMessages').danger(message);
      });
    }
  }
});
