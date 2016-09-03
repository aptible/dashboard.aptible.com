import Ember from 'ember';

export default Ember.Route.extend({
  complianceStatus: Ember.inject.service(),
  title() {
    let organization = this.get('complianceStatus.organization');
    return `${organization.get('name')} Risk Assessments`;
  },

  model() {
    let organization = this.get('complianceStatus.organization');
    let organizationProfile = this.modelFor('gridiron-admin');
    let riskAssessments =  organizationProfile.get('riskAssessments');

    return Ember.RSVP.hash({
      organization, organizationProfile, riskAssessments
    });
  }
});
