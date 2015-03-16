import Ember from 'ember';

export default Ember.Component.extend({
  isDevelopment: Ember.computed.equal('plan', 'development'),
  isPlatform: Ember.computed.equal('plan', 'platform')
});
