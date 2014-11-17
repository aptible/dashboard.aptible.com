import Ember from 'ember';

Ember.Test.registerAsyncHelper('signIn', function(app){
  // TBD
});

Ember.Test.registerAsyncHelper('signInAndVisit', function(app, url){
  signIn();
  visit(url);
});
