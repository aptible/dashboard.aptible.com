import Ember from 'ember';

var hoursPerMonth = 731;
var centsToDollars = function(cents) {
  return '$' + (cents/100).toFixed(2);
};

export default Ember.Component.extend({
  rateInDollars: Ember.computed('stack.appContainerCentsPerHour', function() {
    return centsToDollars(this.get('stack.appContainerCentsPerHour'));
  }),

  unitOfMeasure: Ember.computed('stack.type', 'count', function() {
    if(!this.get('stack.type')) { return ''; }

    var p = this.get('count') === 1 ? '' : 's';
    return this.get('stack.type').capitalize() + ' App Container' + p;
  }),

  total: Ember.computed('stack.appContainerCentsPerHour', 'count', 'size', function() {
    return centsToDollars(
      hoursPerMonth * (this.get('count') * (this.get('size') / 1024)) * this.get('stack.appContainerCentsPerHour')
    );
  })
});
