import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['change-plan-callout'],
  isDevelopment: Ember.computed.equal('value', 'development'),
  isPlatform: Ember.computed.equal('value', 'platform'),

  actions: {
    setPlan: function(plan) {
      this.set('value', plan);
    }
  }
});
