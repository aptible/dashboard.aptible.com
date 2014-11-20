import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    var route = this;
    return this.session.fetch('aptible').then(function() {
      route.replaceWith('apps');
    }, function() {
      route.replaceWith('login');
    });
  }
});
