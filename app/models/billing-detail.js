import DS from 'ember-data';
import Ember from 'ember';

export const CONTAINER_CENTS_PER_HOUR = 8;
export const DISK_CENTS_PER_HOUR = .0507;
export const DOMAIN_CENTS_PER_HOUR = 5;

// All monetary calculations are done in cents
export const PLAN_RATES = {
  development: 0,
  platform: 49900,
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

  containersInPlan: Ember.computed('containerAllowance', 'plan', function() {
    var plan = this.get('plan');
    if (plan === 'development' || !CONTAINER_ALLOWANCES.hasOwnProperty(plan)) {
      return 0;
    }
    return this.get('containerAllowance') || CONTAINER_ALLOWANCES[plan];
  }),

  diskSpaceInPlan: Ember.computed('diskAllowance', 'plan', function() {
    var plan = this.get('plan');
    if (plan === 'development' || !DISK_ALLOWANCES.hasOwnProperty(plan)) {
      return 0;
    }
    return this.get('diskAllowance') || DISK_ALLOWANCES[plan];
  }),

  domainsInPlan: Ember.computed('domainAllowance', 'plan', function() {
    var plan = this.get('plan');
    if (plan === 'development' || !DOMAIN_ALLOWANCES.hasOwnProperty(plan)) {
      return 0;
    }
    return this.get('domainAllowance') || DOMAIN_ALLOWANCES[plan];
  })
});
