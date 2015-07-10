import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Route.extend({
  model() {
    const organization = this.modelFor('organization');
    const billingDetail = this.store.find('billing-detail', organization.get('id'));
    return Ember.RSVP.hash({
      organization: organization,
      billingDetail: billingDetail
    });
  },

  setupController(controller, model) {
    controller.set('model', model.organization);
    controller.set('billingDetail', model.billingDetail);
  },

  afterModel(model) {
    return Ember.RSVP.all([
      model.organization.get('users'),
      model.organization.get('securityOfficer')
    ]);
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
