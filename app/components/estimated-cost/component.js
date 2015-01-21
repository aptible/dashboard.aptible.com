import Ember from 'ember';

export default Ember.Component.extend({
  hoursPerMonth: 731,

  rateInDollars: function() {
    return this.centsToDollars(this.get('stack.appContainerCentsPerHour'));
  }.property('stack.appContainerCentsPerHour'),

  unitOfMeasure: function() {
    if(!this.get('stack.type')) { return ''; }

    var p = this.get('count') === 1 ? '' : 's';
    return this.get('stack.type').capitalize() + ' App Container' + p;
  }.property('stack.type', 'count'),

  total: function() {
    return this.centsToDollars(
      this.get('hoursPerMonth') * this.get('count') * this.get('stack.appContainerCentsPerHour')
    );
  }.property('stack.appContainerCentsPerHour', 'count'),

  centsToDollars: function(cents) {
    return '$' + (cents/100).toFixed(2);
  }
});