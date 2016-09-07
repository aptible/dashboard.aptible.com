import Ember from 'ember';

export default Ember.Controller.extend({
  newCertificate: null,
  persistedCertificates: Ember.computed.filterBy('model', 'isNew', false),
  hasNoCertificates: Ember.computed.equal('persistedCertificates.length', 0)
});
