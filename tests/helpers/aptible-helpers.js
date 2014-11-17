import Ember from 'ember';

Ember.Test.registerAsyncHelper('signIn', function(app){
  // TBD
});

Ember.Test.registerAsyncHelper('signInAndVisit', function(app, url){
  signIn();
  visit(url);
});

Ember.Test.registerHelper('equalElementText', function(app, node, expectedText){
  equal(node.text().trim(), expectedText, "Element's text did not match expected value");
  // TBD
});
