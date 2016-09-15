import Ember from 'ember';
import OrganizationProfile from 'diesel/models/organization-profile';
import GenericCriterionStatus from 'diesel/utils/generic-criterion-status';
import AppCriterionStatus from 'diesel/utils/app-criterion-status';
import UserCriterionStatus from 'diesel/utils/user-criterion-status';
import CriterionAlertsMixin from 'diesel/mixins/services/criterion-alerts';

export default Ember.Service.extend(CriterionAlertsMixin, {
  store: Ember.inject.service(),

  requiresSPD: Ember.computed.not('organizationProfile.hasCompletedSetup'),

  loadOrganizationStatus(authorizationContext) {
    Ember.assert('An authorizationContext is requried in order to load compliance status', authorizationContext);
    let organization = authorizationContext.get('organization');

    this.set('organization', organization);
    this.set('authorizationContext', authorizationContext);

    let documentQuery = { organization: organization.get('data.links.self') };
    let store = this.get('store');
    let complianceStatus = this;

    var model;

    return new Ember.RSVP.Promise((resolve) => {
      // Load data:
      // 1. Criteria
      // 2. Documents for each relevant criterion
      // 3. Various Compliance needs: roles, invitations, users
      //    and organization profile

      store.find('criterion')
      .then((criteria) => {
        let policyCriterion = criteria.findBy('handle', 'policy_manual');
        let riskCriterion = criteria.findBy('handle', 'risk_assessment');
        let appSecurityCriterion = criteria.findBy('handle', 'app_security_interview');
        let trainingCriterion = criteria.findBy('handle', 'training_log');
        let securityOfficerTrainingCriterion = criteria.findBy('handle', 'security_officer_training_log');

        return Ember.RSVP.hash({
          criteria, policyCriterion, riskCriterion, appSecurityCriterion,
          trainingCriterion, organization,
          policyManualDocuments: policyCriterion.get('documents', documentQuery),
          riskAssessmentDocuments: riskCriterion.get('documents', documentQuery),
          appSecurityDocuments: appSecurityCriterion.get('documents', documentQuery),
          trainingDocuments: trainingCriterion.get('documents', documentQuery),
          securityOfficerTrainingDocuments: securityOfficerTrainingCriterion.get('documents', documentQuery),
          stacks: store.findStacksFor(organization),
          securityOfficer: organization.get('securityOfficer'),
          roles: organization.get('roles'),
          invitations: organization.get('invitations'),
          users: organization.get('users'),
          organizationProfile: OrganizationProfile.findOrCreate(organization, store),
          billingDetail: organization.get('billingDetail')
        });
      })
      .then((models) => {
        let {
          organization,
          criteria,
          stacks,
          securityOfficer,
          roles,
          invitations,
          users,
          organizationProfile,
          billingDetail
        } = models;

        // Transform the above hash into something more readable
        model = {
          // Various things
          organization, criteria, stacks, securityOfficer, roles, invitations, users, organizationProfile, billingDetail,
          // Engines are wrapped in CriterionStatus object
          // CriterionStatus objects have methods for converting criteiron status into readable strings
          policy: GenericCriterionStatus.create({ complianceStatus, criterion: models.policyCriterion, documents: models.policyManualDocuments }),
          risk:  GenericCriterionStatus.create({ complianceStatus, criterion: models.riskCriterion, documents: models.riskAssessmentDocuments }),
          training: UserCriterionStatus.create({ complianceStatus, criterion: models.trainingCriterion, documents: models.trainingDocuments }),
          securityOfficerTraining: UserCriterionStatus.create({ complianceStatus, criterion: models.securityOfficerTrainingCriterion, documents: models.securityOfficerTrainingDocuments }),
          security: AppCriterionStatus.create({ complianceStatus, criterion: models.appSecurityCriterion, documents: models.appSecurityDocuments })
        };

        // Apps are loaded as a `hasMany` on stacks
        // iterate all production stacks and map apps to an array of promises
        let productionStacks = model.stacks.filterBy('type', 'production');
        return Ember.RSVP.all(productionStacks.map((s) => s.get('apps')));
      })
      .then((productionStacksApps) => {
        let productionApps = [];

        // productionStacksApps is an array of arrays.  Flatten the arrays into
        // a single array of production apps and store on model.
        productionStacksApps.forEach((apps) => {
          apps.forEach((app) => productionApps.push(app));
        });

        model.productionApps = productionApps;
        this.setProperties(model);

        resolve(this);
      });
    });
  }
});


