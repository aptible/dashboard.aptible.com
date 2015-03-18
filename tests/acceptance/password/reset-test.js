import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest, jsonMimeType } from '../../helpers/fake-server';

var App;

module('Acceptance: PasswordReset', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /password/reset works', function() {
  visit('/password/reset');
  andThen(function(){
    equal(currentPath(), 'password.reset');
  });
});

test('visiting /password/reset signed in redirects to index', function() {
  stubOrganization();
  stubOrganizations();
  stubStacks();
  signInAndVisit('/password/reset');
  andThen(function(){
    equal(currentPath(), 'stacks.index');
  });
});

test('visiting /password/reset and submitting an email creates password reset', function() {
  expect(2);
  var email = 'myEmail@email.com';

  stubRequest('post', '/password/resets/new', function(request){
    var json = this.json(request);
    equal(json.email, email, 'email is sent');
    return this.success(200, jsonMimeType, {});
  });

  visit('/password/reset');
  fillIn('[type=email]', email);
  click('button:contains(Email me reset instructions)');
  andThen(function(){
    equal(currentPath(), 'login');
  });
});

test('visiting /password/reset and submitting an email handles error and resets upon departure', function() {
  expect(5);
  var email = 'myEmail@email.com';

  stubRequest('post', '/password/resets/new', function(request){
    return this.notFound();
  });

  visit('/password/reset');
  fillIn('[type=email]', email);
  click('button:contains(Email me reset instructions)');
  andThen(function(){
    ok(find(':contains(There was an error resetting)'), 'error is on the page');
    equal(currentPath(), 'password.reset');
  });
  visit('/login');
  visit('/password/reset');
  andThen(function(){
    ok(find(':contains(There was an error resetting)').length === 0, 'error is not on the page');
    ok(find('[type=email]'), 'email prompt is on the page');
    equal(currentPath(), 'password.reset');
  });
});
