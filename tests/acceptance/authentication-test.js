import Ember from 'ember';
import startApp from '../helpers/start-app';
import Pretender from "pretender";

var App, server;

module('Acceptance: Authentication', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    if (server) {
      server.shutdown();
    }
  }
});

test('visiting /login', function() {
  visit('/login');

  andThen(function() {
    equal(currentPath(), 'login');
    findWithAssert('input[type=email]');
    findWithAssert('input[type=password]');
  });
});

test('logging in with bad credentials', function() {
  var email = 'bad@email.com';
  var password = 'incorrect';
  var errorMessage = "Bad Password";

  server = new Pretender(function(){
    this.post('/api/session', function(request){
      var params = JSON.parse(request.requestBody);
      equal(params.email, email, 'correct email is passed');
      equal(params.password, password, 'correct password is passed');

      return [500, {}, {error: {message: errorMessage}}];
    });
  });

  visit('/login');
  fillIn('input[type=email]', email);
  fillIn('input[type=password]', password);
  click('button:contains(Log in)');
  andThen(function(){
    equal(currentPath(), 'login');
    var error = findWithAssert('.error');
    equalElementText(error, 'Error authenticating: '+errorMessage);
  });
});

test('logging in with correct credentials', function() {
  var email = 'good@email.com';
  var password = 'correct';

  server = new Pretender(function(){
    this.post('/api/session', function(request){
      var params = JSON.parse(request.requestBody);
      equal(params.email, email, 'correct email is passed');
      equal(params.password, password, 'correct password is passed');

      return [200, {}, {}];
    });
  });

  visit('/login');
  fillIn('input[type=email]', email);
  fillIn('input[type=password]', password);
  click('button:contains(Log in)');
  andThen(function(){
    equal(currentPath(), 'apps.index');
  });
});
