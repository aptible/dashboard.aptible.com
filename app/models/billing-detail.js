import DS from 'ember-data';
import Ember from 'ember';

export const CONTAINER_CENTS_PER_HOUR = 8;
export const DISK_CENTS_PER_HOUR = .0507;
export const DOMAIN_CENTS_PER_HOUR = 5;

// All monetary calculations are done in cents
export const PLAN_RATES = {
  development: 0,
  platform: 99900,
  pilot: 99900,
  production: 349900
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
  containerAllowance: DS.attr('number'),
  diskAllowance: DS.attr('number'),
  domainAllowance: DS.attr('number'),
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
  allowPHI: Ember.computed.match('plan', /pilot|production|platform/),
  hasCompliancePlan: Ember.computed.match('plan', /pilot|production/),
  hasStripeSubscription: Ember.computed.bool('stripeSubscriptionId'),
  hasStripeCustomer: Ember.computed.bool('stripeCustomerId'),
  hasStripe: Ember.computed.and('hasStripeCustomer', 'hasStripeSubscription'),
  accountBalance: DS.attr('number'),
  planRate: DS.attr('number'),
  coupon: DS.attr(),

  // Temporary rate and allowance stubs until these are fulfilled with
  // customer-specific values from Billing API
  containerCentsPerHour: CONTAINER_CENTS_PER_HOUR,
  diskCentsPerHour: DISK_CENTS_PER_HOUR,
  domainCentsPerHour: DOMAIN_CENTS_PER_HOUR,

  containersInPlan: Ember.computed('containerAllowance', 'plan', function() {
    return this.get('containerAllowance') || CONTAINER_ALLOWANCES[this.get('plan')] || 0;
  }),

  diskSpaceInPlan: Ember.computed('diskAllowance', 'plan', function() {
    return this.get('diskAllowance') || DISK_ALLOWANCES[this.get('plan')] || 0;
  }),

  domainsInPlan: Ember.computed('domainAllowance', 'plan', function() {
    return this.get('domainAllowance') || DOMAIN_ALLOWANCES[this.get('plan')] || 0;
  }),

  hasCredit: Ember.computed('accountBalance', function() {
    return this.get('accountBalance') < 0;
  }),

  accountCredit: Ember.computed('accountBalance', 'hasCredit', function() {
    if (this.get('hasCredit')) {
      return -1 * this.get('accountBalance');
    }
    return 0;
  }),

  hasDiscounts: Ember.computed('hasCredit', 'coupon', function() {
    return this.get('hasCredit') || !!this.get('coupon');
  })
});
