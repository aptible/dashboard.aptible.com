import Ember from "ember";

Ember.Test.registerAsyncHelper('expectRequiresAuthentication', function(app, url){
  visit(url);

  andThen(function(){
    equal(currentPath(), 'login');
  });
});
