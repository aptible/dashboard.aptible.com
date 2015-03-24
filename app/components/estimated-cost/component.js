import Ember from 'ember';

var hoursPerMonth = 731;
var centsToDollars = function(cents) {
  return '$' + (cents/100).toFixed(2);
};

export default Ember.Component.extend({
  updateVisibility: function() {
    this.set('isVisible', this.features.isEnabled('price-estimator'));
  }.on('didInsertElement'),
  rateInDollars: function() {
    return centsToDollars(this.get('stack.appContainerCentsPerHour'));
  }.property('stack.appContainerCentsPerHour'),

  unitOfMeasure: function() {
    if(!this.get('stack.type')) { return ''; }

    var p = this.get('count') === 1 ? '' : 's';
    return this.get('stack.type').capitalize() + ' App Container' + p;
  }.property('stack.type', 'count'),

  total: function() {
    return centsToDollars(
      hoursPerMonth * this.get('count') * this.get('stack.appContainerCentsPerHour')
    );
  }.property('stack.appContainerCentsPerHour', 'count')
});