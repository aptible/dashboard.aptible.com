import DS from 'ember-data';

export default DS.Model.extend({
  plan: DS.attr(),
  paymentMethodName: DS.attr(),
  paymentMethodDisplay: DS.attr(),
  nextInvoiceDate: DS.attr('iso-8601-timestamp'),
  paymentExpMonth: DS.attr('number'),
  paymentExpYear: DS.attr('number')
});
