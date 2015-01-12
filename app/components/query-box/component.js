import Ember from 'ember';

export default Ember.Component.extend({
  className: ['query-box'],

  noEmail: function(){
    var hasEmail = this.get('analytics.hasEmail');
    if (hasEmail) {
      return false;
    }
    return !this.get('email');
  }.property('analytics.hasEmail', 'email'),

  isVisible: function(){
    var hasEmail = this.get('analytics.hasEmail');
    return hasEmail === true || hasEmail === false;
  }.property('analytics.hasEmail'),

  actions: {

    submit: function(email){
      if (email) {
        var component = this;
        this.analytics.identify(email).then(function(){
          component.analytics.showChat();
        });
      } else {
        this.analytics.showChat();
      }
    }

  }
});
