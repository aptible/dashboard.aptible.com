import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params){
    var options = {
      verificationCode: params.verification_code,
      type: 'email'
    };
    var verification = this.store.createRecord('verification', options);
    return verification.save();
  },

  afterModel: function() {
    this.replaceWith('index');
  }

});
