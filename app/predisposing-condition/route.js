import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    let riskAssessmentId = params.id.split('_')[0];
    return new Ember.RSVP.Promise((resolve, reject) => {
      let findPromise = this.store.find('riskAssessment', riskAssessmentId);

      findPromise.then((riskAssessment) => {
        resolve({
          riskAssessment,
          predisposingCondition: riskAssessment.get('predisposingConditions').findBy('id', params.id)
        });
      }, reject);

    });
  },

  setupController(controller, model) {
    controller.set('riskAssessment', model.riskAssessment);
    controller.set('model', model.predisposingCondition);
  }
});
