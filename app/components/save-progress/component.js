import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['hasProgress:loading'],
  classNames: ['save-progress'],
  hasProgress: Ember.computed.gt('progress.currentStep', 0),
  showProgressBar: Ember.computed.and('hasProgress', 'incomplete'),

  incomplete: function() {
    return this.get('progress.currentStep') < this.get('progress.totalSteps');
  }.property('progress.currentStep', 'progress.totalSteps'),

  progressPercent: function() {
    var current = this.get('progress.currentStep');
    var total = this.get('progress.totalSteps');
    return (current/total) * 100;
  }.property('progress.totalSteps', 'progress.currentStep'),

  progressWidth: function() {
    return `width:${this.get('progressPercent')}%`;
  }.property('progressPercent')
});
