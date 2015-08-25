import DS from 'ember-data';
import Ember from 'ember';

export const CONTAINER_CENTS_PER_HOUR = 8;
export const DISK_CENTS_PER_HOUR = .05;
export const DOMAIN_CENTS_PER_HOUR = 5;
export const PLAN_RATES = {
  development: 0,
  platform: 499,
  pilot: 999,
  production: 3499
};

export const CONTAINER_ALLOWANCES = {
  development: 0,
  platform: 6,
  pilot: 6,
  production: 6
};

export const DISK_ALLOWANCES = {
  development: 0,
  platform: 1000,
  pilot: 1000,
  production: 1000
};

export const DOMAIN_ALLOWANCES = {
  development: 0,
  platform: 4,
  pilot: 4,
  production: 4
};

export default DS.Model.extend({
  plan: DS.attr('string'),
  paymentMethodName: DS.attr('string'),
  paymentMethodDisplay: DS.attr('string'),
  nextInvoiceDate: DS.attr('iso-8601-timestamp'),
  stripeSubscriptionId: DS.attr('string'),
  stripeCustomerId: DS.attr('string'),
  stripeToken: DS.attr('string'),
  paymentExpMonth: DS.attr('number'),
  paymentExpYear: DS.attr('number'),
  billingContact: DS.belongsTo('user', {async:true}),
  organization: DS.belongsTo('organization', {async:true}),
  allowPHI: Ember.computed.match('plan', /production|platform/),
  hasStripeSubscription: Ember.computed.bool('stripeSubscriptionId'),
  hasStripeCustomer: Ember.computed.bool('stripeCustomerId'),
  hasStripe: Ember.computed.and('hasStripeCustomer', 'hasStripeSubscription'),

  // Temporary rate and allowance stubs until these are fulfilled with
  // customer-specific values from Billing API
  containerCentsPerHour: CONTAINER_CENTS_PER_HOUR,
  diskCentsPerHour: DISK_CENTS_PER_HOUR,
  domainCentsPerHour: DOMAIN_CENTS_PER_HOUR,
  planRate: Ember.computed('plan', function() {
    return PLAN_RATES[this.get('plan')];
  }),
  containerAllowance: Ember.computed('plan', function() {
    return CONTAINER_ALLOWANCES[this.get('plan')];
  }),
  diskAllowance: Ember.computed('plan', function() {
    return DISK_ALLOWANCES[this.get('plan')];
  }),
  domainAllowance: Ember.computed('plan', function() {
    return DOMAIN_ALLOWANCES[this.get('plan')];
  })
});
