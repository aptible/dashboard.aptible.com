import Ember from 'ember';

let Alert = Ember.Object.extend();

export default Ember.Service.extend({
  policyManualDocuments: null,
  riskAssessmentDocuments: null,
  appSecurityDocuments: null,
  trainingDocuments: null,
  productionApps: null,
  users: null,

  alertCount: Ember.computed.reads('alerts.length'),
  allAlerts: Ember.computed('riskAssessmentAlerts.[]', 'policyManualAlerts.[]', 'appSecurityAlerts.[]', 'basicTrainingAlerts.[]', function() {
    let alerts = [];

    alerts = alerts.concat(this.get('riskAssessmentAlerts'));
    alerts = alerts.concat(this.get('policyManualAlerts'));
    alerts = alerts.concat(this.get('appSecurityAlerts'));
    alerts = alerts.concat(this.get('basicTrainingAlerts'));

    return alerts;
  }),

  riskAssessmentAlerts: Ember.computed('riskAssessmentDocuments.[]', function() {
    if(this.get('riskAssessmentDocuments').filterBy('isExpired', false).length === 0) {
      let message = 'Missing Risk Assessment';

      if(this.get('riskAssessmentDocuments.length') > 0) {
        message = 'Risk Assessment expired.';
      }

      return [Alert.create({ type: 'riskAssessment', message })];
    }

    return [];
  }),

  policyManualAlerts: Ember.computed('policyManualDocuments.[]', function() {
    if(this.get('policyManualDocuments').filterBy('isExpired', false).length === 0) {
      let message = 'Missing Policy Manual';

      if(this.get('policyManualDocuments.length') > 0) {
        message = 'Policy Manual Expired';
      }

      return [Alert.create({ type: 'policyManual', message })];
    }

    return [];
  }),

  appSecurityAlerts: Ember.computed('productionApps.[]', 'appSecurityDocuments.[]', function() {
    let alerts = [];

    this.get('productionApps').forEach((app) => {
      let appUrl = app.get('data.links.self');
      let appDocuments = this.get('appSecurityDocuments').filterBy('appUrl', appUrl);

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

  basicTrainingAlerts: Ember.computed('users.[]', 'trainingDocuments.[]', function() {
    let alerts = [];
    this.get('users').forEach((user) => {
      let userUrl = user.get('data.links.self');
      let userDocuments = this.get('trainingDocuments').filterBy('userUrl', userUrl);

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