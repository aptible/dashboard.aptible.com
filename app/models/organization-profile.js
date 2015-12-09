import DS from 'ember-data';
import Ember from 'ember';

export const SETUP_STEPS = ['start', 'organization', 'locations', 'team',
                            'data-environments', 'security-controls', 'finish'];

let OrganizationProfile = DS.Model.extend({
  currentStep: DS.attr('string', { defaultValue: SETUP_STEPS[0] }),
  hasCompletedSetup: DS.attr('boolean'),
  aboutOrganization: DS.attr('string'),
  aboutProduct: DS.attr('string'),
  selectedDataEnvironments: DS.attr(),

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

  next(currentStep) {
    let currentStepIndex = this.indexOfStep(currentStep);
    this.set('currentStep', SETUP_STEPS[currentStepIndex + 1]);

    return this;
  },

  previous(currentStep) {
    let currentStepIndex = this.indexOfStep(currentStep);
    this.set('currentStep', SETUP_STEPS[(currentStepIndex - 1) || 0]);

    return this;
  }
});

OrganizationProfile.reopenClass({
  create(organization, store) {
    let newProfileParams = { id: organization.get('id') };
    return store.createRecord('organization-profile', newProfileParams);
  },

  findOrCreate(organization, store) {
    return new Ember.RSVP.Promise((resolve) => {
      store.find('organization-profile', organization.get('id'))
        .then((profile) => { resolve(profile); })
        .catch(() => { resolve(this.create(organization, store)); });
    });
  }
});

export default OrganizationProfile;