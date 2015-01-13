import {
  moduleFor,
  test
} from 'ember-qunit';
import { mockAnalytics } from "../../helpers/mock-analytics";

var oldPage;
var oldIdentify;
var oldUser;

moduleFor('service:analytics', 'AnalyticsService', {
  setup: function(){
    oldPage = mockAnalytics.page;
    oldIdentify = mockAnalytics.identify;
    oldUser = mockAnalytics.user;
  },
  teardown: function(){
    mockAnalytics.page = oldPage;
    mockAnalytics.identify = oldIdentify;
    mockAnalytics.user = oldUser;
  }
});

test('it tracks a page', function() {
  expect(2);
  var service = this.subject();

  var page = 'Signup';
  mockAnalytics.page = function(data, fn){
    equal(data, page, 'page is passed to tracker');
    setTimeout(fn, 2);
  };

  return service.page(page).then(function(){
    ok(true, 'promise is called');
  });
});

test('it identifies with email', function() {
  expect(4);
  var service = this.subject();
  equal(service.get('hasEmail'), undefined, 'precond - hasEmail is undefined');

  var email = 'some@email.com';

  mockAnalytics.identify = function(data, fn){
    equal(data.email, email, 'email is passed to tracker');
    setTimeout(fn, 2);
  };

  mockAnalytics.user = function(){
    return {
      traits: function(){
        return { email: email };
      }
    };
  };

  return service.identify(email).then(function(){
    ok(true, 'promise is called');
    ok(service.get('hasEmail'), 'has an email');
  });
});
