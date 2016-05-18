import Ember from "ember";

Ember.Test.registerAsyncHelper('expectRequiresAuthentication', function(app, url){
  visit(url);

  andThen(function(){
    QUnit.equal(currentPath(), 'login');
  });
});

Ember.Test.registerAsyncHelper('expectRequiresElevation', function(app, url){
  visit(url);

  andThen(() => {
    QUnit.equal(currentPath(), 'elevate');
  });
});
