import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  extract: function(store, type, payload, id, requestType) {
    this.__requestType = requestType; // used by `extractMeta`
    return this.normalize(type, payload);
  },

  attrs: {
    paymentExpMonth: {serialize: false},
    paymentExpYear: {serialize: false},
    paymentMethodName: {serialize: false},
    paymentMethodDisplay: {serialize: false},
    nextInvoiceDate: {serialize: false},
    organization: {serialize: false},
    stripeSubscriptionId: {serialize: false},
    stripeCustomerId: {serialize: false}
  }
});
