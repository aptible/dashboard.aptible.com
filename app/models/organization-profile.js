import DS from 'ember-data';
import Ember from 'ember';

export const SETUP_STEPS = ['organization', 'locations', 'team',
                            'data-environments', 'security-controls'];

export default DS.Model.extend({
  currentStep: DS.attr('string', { defaultValue: SETUP_STEPS[0] }),
  hasCompletedSetup: DS.attr('boolean'),
  aboutOrganization: DS.attr('string'),
  aboutProduct: DS.attr('string'),

  indexOfCurrentStep: Ember.computed('currentStep', function() {
    return this.indexOfStep(this.get('currentStep'));
  }),

  previousStep: Ember.computed('indexOfCurrentStep', function() {
    return SETUP_STEPS[this.get('indexOfCurrentStep') - 1];
  }),

  nextStep: Ember.computed('indexOfCurrentStep', function() {
    return SETUP_STEPS[this.get('indexOfCurrentStep') + 1];
  }),

  indexOfStep(step) {
    return SETUP_STEPS.indexOf(step);
  },

  isReadyForStep(step) {
    return this.indexOfStep(step) <= this.get('indexOfCurrentStep');
  },

  next() {
    let currentStepIndex = this.get('indexOfCurrentStep');
    this.set('currentStep', SETUP_STEPS[currentStepIndex + 1]);

    return this;
  },

  previous() {
    let currentStepIndex = this.get('indexOfCurrentStep');
    this.set('currentStep', SETUP_STEPS[(currentStepIndex - 1) || 0]);

    return this;
  }
});
