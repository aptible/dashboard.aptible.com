import Ember from 'ember';
import { provisionDatabases } from '../models/database';

export default Ember.Route.extend({
  model(params){
    var options = {
      verificationCode: params.verification_code,
      type: 'email'
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
