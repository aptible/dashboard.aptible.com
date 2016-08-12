import Ember from 'ember';

export default Ember.Route.extend({
  title() {
    let organization = this.modelFor('compliance-organization');
    return `${organization.get('name')} Risk Assessments`;
  },

  model() {
    let organization = this.modelFor('compliance-organization');
    let organizationProfile = this.modelFor('compliance-engines');
    let riskAssessments =  organizationProfile.get('riskAssessments');

    return Ember.RSVP.hash({
      organization, organizationProfile, riskAssessments
    });
  }
});
