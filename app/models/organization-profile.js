import DS from 'ember-data';
import Ember from 'ember';
import config from "diesel/config/environment";

export var SETUP_STEPS = ['start', 'organization', 'locations', 'team',
                          'predisposing-conditions', 'security-controls', 'finish'];

if(!config.featureFlags.dataEnvironments) {
  SETUP_STEPS = SETUP_STEPS.removeAt(4);
}

let OrganizationProfile = DS.Model.extend({
  currentStep: DS.attr('string', { defaultValue: SETUP_STEPS[0] }),
  hasCompletedSetup: DS.attr('boolean', { defaultValue: false }),
  aboutOrganization: DS.attr('string'),
  aboutProduct: DS.attr('string'),
  aboutArchitecture: DS.attr('string'),
  aboutBusinessModel: DS.attr('string'),
  aboutTeam: DS.attr('string'),
  aboutGoToMarket: DS.attr('string'),
  organization: DS.attr('string'),
  attestations: DS.hasMany('attestation', {async: true}),
  riskAssessments: DS.hasMany('risk-assessment', { async: true }),

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
    let newProfileParams = { id: organization.get('id'),
                             organization: organization.get('data.links.self') };
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
