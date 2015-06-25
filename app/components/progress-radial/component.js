import Ember from 'ember';

export default Ember.Component.extend({
  stepSize: 5,

  progressPercent: Ember.computed('completed', 'total', function() {
    let completed = this.get('completed');
    let total = this.get('total');

    if(total === 0) {
      return 0;
    }

    return (completed / total) * 100;
  }),

  steppedPercent: Ember.computed('progressPercent', function() {
    let stepSize = this.get('stepSize');
    let percent = this.get('progressPercent');

    return stepSize * Math.round(percent/stepSize);
  })
});
