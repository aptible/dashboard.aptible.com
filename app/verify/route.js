import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel: function(){
    var route = this;
    if (!this.session.get('isAuthenticated')) {
      return this.session.fetch('aptible').catch(function(){
        route.transitionTo('login');
      });
    }
  },

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
