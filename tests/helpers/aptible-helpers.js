import Ember from 'ember';
import { locationHistory } from '../../utils/location';
import { stubRequest } from "./fake-server";

Ember.Test.registerAsyncHelper('signIn', function(app){
  var session = app.__container__.lookup('torii:session');
  var sm = session.get('stateMachine');

  Ember.run(function(){
    sm.transitionTo('authenticated');
  });
});

Ember.Test.registerAsyncHelper('signInAndVisit', function(app, url){
  signIn();
  visit(url);
});

Ember.Test.registerAsyncHelper('locationUpdatedTo', function(app, url){
  equal(locationHistory.last, url, 'window.location updated to expected URL');
});

Ember.Test.registerHelper('equalElementText', function(app, node, expectedText){
  equal(node.text().trim(), expectedText, "Element's text did not match expected value");
});

Ember.Test.registerHelper('elementTextContains', function(app, node, expectedText){
  var nodeText = node.text();
  ok( nodeText.indexOf(expectedText) !== -1,
      "Element's text did not match expected value, was: '"+nodeText+"'" );
});

Ember.Test.registerHelper('stubApps', function(app){
  stubRequest('get', '/apps', function(request){
    return this.success({
      _links: {},
      _embedded: {
        apps: [{
          _links: {
            self: { href: '...' }
          },
          id: 1,
          handle: 'my-app'
        }, {
          _links: {
            self: { href: '...' }
          },
          id: 2,
          handle: 'my-app-2'
        }]
      }
    });
  });
});
