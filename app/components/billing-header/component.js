import Ember from 'ember';

const reads = Ember.computed.reads;

export default Ember.Component.extend({
  organization: null,
  billingDetail: null,

  isLoaded: Ember.computed.notEmpty('billingDetail'),
  plan: reads('organization.plan'),
  paymentMethodName: reads('billingDetail.paymentMethodName'),
  paymentMethodDisplay: reads('billingDetail.paymentMethodDisplay'),
  nextInvoiceDate: reads('billingDetail.nextInvoiceDate'),

  init() {
    this._super(...arguments);
    this.get('organization.billingDetail').then((billingDetail) => {
      this.set('billingDetail', billingDetail);
    });
  }

});
