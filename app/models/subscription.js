import DS from 'ember-data';

export default DS.Model.extend({
  stripeToken: DS.attr('string'),
  plan: DS.attr('string'),
  organization: DS.belongsTo('organization', {async: true})
});
