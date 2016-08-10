import Ember from 'ember';
import OrganizationProfile from 'diesel/models/organization-profile';
import CriterionStatusMixin from 'diesel/mixins/services/criterion-status';

let Alert = Ember.Object.extend();
let CriterionStatus = Ember.Object.extend(CriterionStatusMixin, {});

export default Ember.Service.extend({
  store: Ember.inject.service(),

  loadOrganizationStatus(organization) {
    Ember.assert('An organization is requried in order to load compliance status', organization);

    this.set('organization', organization);
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
          organizationProfile: OrganizationProfile.findOrCreate(organization, store)
        });
      })
      .then((models) => {
        let { organization, criteria, stacks, securityOfficer, roles, invitations, users, organizationProfile } = models;
        // Transform the above hash into something more readable
        model = {
          // Various things
          organization, criteria, stacks, securityOfficer, roles, invitations, users, organizationProfile,
          // Engines are wrapped in CriterionStatus object
          // CriterionStatus objects have methods for converting criteiron status into readable strings
          policy: CriterionStatus.create({ complianceStatus, criterion: models.policyCriterion, documents: models.policyManualDocuments }),
          risk:  CriterionStatus.create({ complianceStatus, criterion: models.riskCriterion, documents: models.riskAssessmentDocuments }),
          training: CriterionStatus.create({ complianceStatus, criterion: models.trainingCriterion, documents: models.trainingDocuments }),
          securityOfficerTraining: CriterionStatus.create({ complianceStatus, criterion: models.securityOfficerTrainingCriterion, documents: models.securityOfficerTrainingDocuments }),
          security: CriterionStatus.create({ complianceStatus, criterion: models.appSecurityCriterion, documents: models.appSecurityDocuments })
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
  },

  alertCount: Ember.computed.reads('allAlerts.length'),
  allAlerts: Ember.computed('riskAssessmentAlerts.[]', 'policyManualAlerts.[]', 'appSecurityAlerts.[]', 'basicTrainingAlerts.[]', function() {
    let alerts = [];

    alerts = alerts.concat(this.get('riskAssessmentAlerts'));
    alerts = alerts.concat(this.get('policyManualAlerts'));
    alerts = alerts.concat(this.get('appSecurityAlerts'));
    alerts = alerts.concat(this.get('basicTrainingAlerts'));

    return alerts;
  }),

  riskAssessmentAlerts: Ember.computed('risk.activeDocuments.[]', function() {
    if(this.get('risk.hasNoActiveDocuments')) {
      let message = 'Missing Risk Assessment';

      if(this.get('risk.documents.length') > 0) {
        message = 'Risk Assessment expired.';
      }

      return [Alert.create({ type: 'riskAssessment', message })];
    }

    return [];
  }),

  policyManualAlerts: Ember.computed('policy.activeDocuments.[]', function() {
    if(this.get('policy.hasNoActiveDocuments')) {
      let message = 'Missing Policy Manual';

      if(this.get('policy.documents.length') > 0) {
        message = 'Policy Manual Expired';
      }

      return [Alert.create({ type: 'policyManual', message })];
    }

    return [];
  }),

  appSecurityAlerts: Ember.computed('productionApps.[]', 'security.documents.[]', function() {
    let alerts = [];

    this.get('productionApps').forEach((app) => {
      let appUrl = app.get('data.links.self');
      let appDocuments = this.get('security.documents').filterBy('appUrl', appUrl);

      if(appDocuments.filterBy('isExpired', false).length === 0) {
        let handle = app.get('handle');
        let message = `Missing Application Security Interview for ${handle}`;

        if(appDocuments.get('length') > 0 ) {
          message = `Application Security Interview expired for ${handle}`;
        }

        alerts.push(Alert.create({ type: 'appSecurity', message }));
      }
    });

    return alerts;
  }),

  basicTrainingAlerts: Ember.computed('users.[]', 'training.documents.[]', function() {
    let alerts = [];
    this.get('users').forEach((user) => {
      let userUrl = user.get('data.links.self');
      let userDocuments = this.get('training.documents').filterBy('userUrl', userUrl);

      if(userDocuments.filterBy('isExpired', false).length === 0) {
        let name = user.get('name');
        let message = `Missing Basic Training for ${name}`;

        if(userDocuments.get('length') > 0) {
          message = `Basic Training expired for ${name}`;
        }

        alerts.push(Alert.create({ type: 'basicTraining', message }));
      }
    });

    return alerts;
  })
});


