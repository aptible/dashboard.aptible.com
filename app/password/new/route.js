import Ember from 'ember';

export default Ember.Route.extend({
  requireAuthentication: false,
  beforeModel: function(){
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (this.session.get('isAuthenticated')) {
        resolve();
      } else {
        this.session.fetch('aptible').then(resolve, reject);
      }
    }).then(() => {
      this.transitionTo('index');
    }, function(){});
  },
  model: function(params){
    return {
      resetCode: params.reset_code,
      userId: params.user_id,
      password: null,
      passwordConfirmation: null
    };
  },

  actions: {
    save: function(model){
      var verification = this.store.createRecord('verification', {
        userId: model.userId,
        resetCode: model.resetCode,
        password: model.password,
        type: 'password_reset'
      });
      verification.save().then( () => {
        this.transitionTo('login');
      }, () => {
        verification.destroy();
        this.controllerFor('password/new').set('error', `
          There was an error resetting your password.
        `);
      });
    }
  }
});
