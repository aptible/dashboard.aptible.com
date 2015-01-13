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

Ember.Test.registerAsyncHelper('clickNextPageLink', function(app){
  click('.pagination .next a');
});

Ember.Test.registerAsyncHelper('clickPrevPageLink', function(app){
  click('.pagination .prev a');
});

Ember.Test.registerHelper('expectPaginationElements', function(app, options){
  options = options || {};

  var pagination = find('.pagination');
  ok(pagination.length, 'has pagination');

  var currentPage = options.currentPage || 1;
  var currentPageEl = find('.current:contains('+currentPage+')', pagination);
  ok(currentPageEl.length, 'has current page: '+currentPage);

  var prevPage = find('.prev', pagination);
  if (options.prevEnabled){
    ok(prevPage.length && !prevPage.hasClass('disabled'), 'enabled prev div');
  } else {
    ok(prevPage.length && prevPage.hasClass('disabled'), 'disabled prev div');
  }

  var nextPage = find('.next', pagination);
  if (options.nextDisabled){
    ok(nextPage.length && nextPage.hasClass('disabled'), 'disabled nextPage page div');
  } else {
    ok(nextPage.length && !nextPage.hasClass('disabled'), 'enabled nextPage page div');
  }
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
            handle: 'my-app-1-stack-1'
          }, {
            id: 2,
            handle: 'my-app-2-stack-1'
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
            handle: 'my-app-1-stack-2'
          }, {
            id: 4,
            handle: 'my-app-2-stack-2'
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
