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

    if(riskAssessments.get('isFulfilled')) {
      riskAssessments = riskAssessments.reload();
    }

    return Ember.RSVP.hash({
      organization, organizationProfile, riskAssessments
    });
  },

  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/engine-sidebar', { into: 'risk-assessments', outlet: 'sidebar' });
  }
});
