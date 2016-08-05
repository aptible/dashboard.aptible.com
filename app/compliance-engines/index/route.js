import Ember from 'ember';

// Compliance Dashboard
// Criterion:
// policy_manual
// risk_assessment
// app_security_interview
// training_log
// developer_training_log
// security_officer_training_log
//
export default Ember.Route.extend({
  model() {
    let organization = this.modelFor('compliance-organization');
    let documentQuery = { organization: organization.get('data.links.self') };

    return this.store.find('criterion').then((criteria) => {
      let policyCriterion = criteria.findBy('handle', 'policy_manual');
      let riskCriterion = criteria.findBy('handle', 'risk_assessment');
      let appSecurityCriterion = criteria.findBy('handle', 'app_security_interview');
      let trainingCriterion = criteria.findBy('handle', 'training_log');

      return Ember.RSVP.hash({
        criteria, policyCriterion, riskCriterion,
        appSecurityCriterion, trainingCriterion,
        policyManualDocuments: policyCriterion.get('documents', documentQuery),
        riskAssessmentDocuments: riskCriterion.get('documents', documentQuery),
        appSecurityDocuments: appSecurityCriterion.get('documents', documentQuery),
        trainingDocuments: trainingCriterion.get('documents', documentQuery),
        stacks: this.store.findStacksFor(organization),
        users: organization.get('users')
      });
    });
  },

  setupController(controller, model) {
    let productionApps = [];

    this._productionAppPromises.forEach((apps) => {
      apps.get('content').forEach((app) => productionApps.push(app));
    });

    model.productionApps = productionApps;
    debugger;
    controller.set('model', model);
  },

  afterModel(model) {
    let productionStacks = model.stacks.filterBy('type', 'production');
    this._productionAppPromises = productionStacks.map((s) => s.get('apps'));
    return Ember.RSVP.all(this._productionAppPromises);
  }
});
