import DS from 'ember-data';

export default DS.Model.extend({
  currentStep: DS.attr('string'),
  completedSetup: DS.attr('boolean'),
  aboutOrganization: DS.attr('string'),
  aboutProduct: DS.attr('string')
});
