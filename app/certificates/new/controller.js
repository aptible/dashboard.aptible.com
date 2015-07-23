import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['stack'],
  persistedCertificates: Ember.computed.alias('controllers.stack.persistedCertificates'),
  showCancelButton: Ember.computed.gt('persistedCertificates.length', 0)
});
