import Ember from 'ember';
import { locationHistory } from '../../utils/location';
import { stubRequest } from "./fake-server";

Ember.Test.registerAsyncHelper('signIn', function(app){
  var session = app.__container__.lookup('torii:session');
  var sm = session.get('stateMachine');

  Ember.run(function(){
    var store = app.__container__.lookup('store:main');
    var user = store.push('user', {
      id: 'user1',
      name: 'stubbed user'
    });
    sm.transitionTo('authenticated');
    session.set('content.currentUser', user);
  });
});

Ember.Test.registerAsyncHelper('signInAndVisit', function(app, url){
  signIn();
  visit(url);
});

Ember.Test.registerAsyncHelper('expectRequiresAuthentication', function(app, url){
  visit(url);

  andThen(function(){
    equal(currentPath(), 'login');
  });
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

Ember.Test.registerHelper('stubStack', function(app, stackData){
  var id = stackData.id;
  if (!id) { throw new Error('cannot stub stack without id'); }

  stubRequest('get', '/accounts/' + id, function(request){
    return this.success(stackData);
  });
});

Ember.Test.registerHelper('stubApp', function(app, appData){
  var id = appData.id;
  if (!id) { throw new Error('cannot stub app without id'); }

  stubRequest('get', '/apps/' + id, function(request){
    return this.success(appData);
  });
});

Ember.Test.registerHelper('stubStacks', function(app, options){
  if (!options) { options = {}; }
  if (options.includeApps === undefined) {
    options.includeApps = true;
  }
  if (options.includeDatabases === undefined) {
    options.includeDatabases = true;
  }

  stubRequest('get', '/accounts', function(request){
    return this.success({
      _links: {},
      _embedded: {
        accounts: [{
          _links: {
            self: { href: '...' },
            apps: { href: '/accounts/my-stack-1/apps' },
            databases: { href: '/accounts/my-stack-1/databases' }
          },
          id: 1,
          handle: 'my-stack-1'
        }, {
          _links: {
            self: { href: '...' },
            apps: { href: '/accounts/my-stack-2/apps' },
            databases: { href: '/accounts/my-stack-2/databases' }
          },
          id: 2,
          handle: 'my-stack-2'
        }]
      }
    });
  });

  if (options.includeDatabases) {
    stubRequest('get', '/accounts/my-stack-1/databases', function(request){
      return this.success({
        _links: {},
        _embedded: {
          databases: [{
            id: 1,
            handle: 'my-db-1-stack-1'
          }, {
            id: 2,
            handle: 'my-db-2-stack-1'
          }]
        }
      });
    });
    stubRequest('get', '/accounts/my-stack-2/databases', function(request){
      return this.success({
        _links: {},
        _embedded: {
          databases: [{
            id: 3,
            handle: 'my-db-1-stack-2'
          }, {
            id: 4,
            handle: 'my-db-2-stack-2'
          }]
        }
      });
    });
  }

  if (options.includeApps) {
    stubRequest('get', '/accounts/my-stack-1/apps', function(request){
      return this.success({
        _links: {},
        _embedded: {
          apps: [{
            id: 1,
            handle: 'my-app-1-stack-1',
            _embedded: {
              services: [{
                id: '1',
                handle: 'the-service'
              }]
            }
          }, {
            id: 2,
            handle: 'my-app-2-stack-1',
            _embedded: {
              services: [{
                id: '2',
                handle: 'the-service-2'
              }]
            }
          }]
        }
      });
    });
    stubRequest('get', '/accounts/my-stack-2/apps', function(request){
      return this.success({
        _links: {},
        _embedded: {
          apps: [{
            id: 3,
            handle: 'my-app-1-stack-2',
            _embedded: {
              services: []
            }
          }, {
            id: 4,
            handle: 'my-app-2-stack-2',
            _embedded: {
              services: []
            }
          }]
        }
      });
    });
  }
});

Ember.Test.registerHelper('expectStackHeader', function(app, stackHandle){
  var handle = find('header .account-handle:contains(' + stackHandle + ')');
  ok(handle.length, 'expected stack header with handle: ' + stackHandle);
});

Ember.Test.registerHelper('stubOrganizations', function(app){
  stubRequest('get', '/organizations', function(request){
    return this.success({
      _links: {},
      _embedded: {
        organizations: [{
          _links: {
          },
          id: 1,
          name: 'Sprocket Co',
          type: 'organization'
        }]
      }
    });
  });
});
