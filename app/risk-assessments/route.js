import Ember from 'ember';

export default Ember.Route.extend({
  title() {
    let organization = this.modelFor('gridiron-organization');
    return `${organization.get('name')} Risk Assessments`;
  },

  model() {
    let organization = this.modelFor('gridiron-organization');
    let organizationProfile = this.modelFor('gridiron-admin');
    let riskAssessments =  organizationProfile.get('riskAssessments');

    return Ember.RSVP.hash({
      organization, organizationProfile, riskAssessments
    });
  }
});
