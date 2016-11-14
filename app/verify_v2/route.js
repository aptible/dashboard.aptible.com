import Ember from 'ember';
import { provisionDatabases } from '../models/database';

export default Ember.Route.extend({
  model(params){
    var options = {
      challengeId: params.challenge_id,
      verificationCode: params.verification_code,
      type: 'email_verification_challenge'
    };

    var verification = this.store.createRecord('verification', options);

    return verification.save().then( () => {
      let user = this.session.get('currentUser');

      // this will update the 'verification' property
      return user.reload();
    }).then( (user) => {
      return provisionDatabases(user, this.store);
    });
  },

  afterModel() {
    this.replaceWith('enclave');
  }
});
