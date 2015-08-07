import Ember from 'ember';
import { createStripeToken } from 'diesel/utils/stripe';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  error: null,

  name: null,
  number: null,
  cvc: null,
  expMonth: null,
  expYear: null,
  zip: null,

  isSaving: false,

  organization: null,
  plan: Ember.computed.reads('organization.billingDetail.plan'),

  actions: {
    saveCC() {
      let {
        name,
        number,
        cvc,
        zip,
        plan,
        organization,
        expMonth: exp_month,
        expYear: exp_year
      } = this.getProperties(
        ['name', 'number', 'cvc',
         'expMonth', 'expYear', 'zip',
         'organization', 'plan']);

      let stripeOptions = { name, number, cvc, exp_month, exp_year, zip };

      this.set('isSaving', true);
      this.set('error', null);
      let success = false;
      createStripeToken(stripeOptions).then(({id: stripeToken}) => {
        const store = this.get('store');
        return store.find('billing-detail', organization.get('id')).catch(() => {
          store.createRecord('billing-detail', {
             id: organization.get('id')
          });
        }).then((model) => {
          model.set('plan', plan);
          model.set('stripeToken', stripeToken);
          return model.save();
        });
      }).then(() => {
        success = true;
      }).catch((e) => {
        const message = e.message ? e.message : e;
        this.set('error', message);
      }).finally(() => {
        this.set('isSaving', false);

        if (success) {
          this.sendAction();
        }
      });
    }
  }
});
