import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;

module('Acceptance: Databases', {
  setup: function() {
    App = startApp();
    // Just needed to stub /stack/my-stack-1/databases
    stubStacks({includeDatabases:true});
    stubStack({
      id: 'my-stack-1',
      handle: 'my-stack-1',
      _links: {
        databases: { href: '/accounts/my-stack-1/databases' },
        organization: { href: '/organizations/1' },
      }
    });
    stubOrganization();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /stacks/:stack_id/databases requires authentication', function(){
  expectRequiresAuthentication('/stacks/my-stack-1/databases');
});

test('visiting /stacks/:stack_id/databases', function() {
  signInAndVisit('/stacks/my-stack-1/databases');

  andThen(function() {
    equal(currentPath(), 'stack.databases.index');
  });
  titleUpdatedTo('my-stack-1 Databases - Sprocket Co');
});

test('visiting /stacks/my-stack-1/databases shows list of databases', function() {
  signInAndVisit('/stacks/my-stack-1/databases');

  andThen(function() {
    var row = findWithAssert('.panel.database');
    equal(row.length, 2, 'shows 2 databases');
  });
});

test('visiting /stacks/my-stack-1/databases then clicking on an database visits the database', function() {
  stubRequest('get', '/databases/1/operations', function(request){
    return this.success({
      _embedded: {
        operations: []
      }
    });
  });

  signInAndVisit('/stacks/my-stack-1/databases');

  andThen(function(){
    var dbLink = find('a[href~="/databases/1"]');
    ok(dbLink.length, 'has link to database');

    click(dbLink);
  });

  andThen(function(){
    equal(currentPath(), 'database.activity', 'show page is visited');
  });
});
