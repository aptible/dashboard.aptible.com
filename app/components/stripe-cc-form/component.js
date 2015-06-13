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
  plan: Ember.computed.reads('organization.plan'),

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
        const subscription = this.get('store').createRecord(
          'subscription', { plan, stripeToken, organization }
        );
        return subscription.save();
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
