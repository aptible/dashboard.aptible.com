import DS from 'ember-data';

export const SETUP_STEPS = ['organization', 'locations', 'team',
                            'dataEnvironments', 'securityControls'];

export default DS.Model.extend({
  currentStep: DS.attr('string', { defaultValue: SETUP_STEPS[0] }),
  hasCompletedSetup: DS.attr('boolean'),
  aboutOrganization: DS.attr('string'),
  aboutProduct: DS.attr('string'),

  indexOfCurrentStep: Ember.computed('currentStep', function() {
    return this.indexOfStep(this.get('currentStep'));
  }),

  indexOfStep(step) {
    return SETUP_STEPS.indexOf(step);
  },

  isReadyForStep(step) {
    return this.indexOfStep(step) <= this.get('indexOfCurrentStep');
  }
});
