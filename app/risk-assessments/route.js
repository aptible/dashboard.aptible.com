import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('compliance-organization');
    let organizationProfile = this.modelFor('engines');
    let riskAssessments =  organizationProfile.get('riskAssessments');

    return Ember.RSVP.hash({
      organization, organizationProfile, riskAssessments
    });
  }
});
