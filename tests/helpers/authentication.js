import Ember from "ember";

Ember.Test.registerAsyncHelper('expectRequiresAuthentication', function(app, url){
  visit(url);

  andThen(function(){
    QUnit.equal(currentPath(), 'login');
  });
});
