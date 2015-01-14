import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { mockStripe } from '../../helpers/mock-stripe';
import { stubRequest } from "../../helpers/fake-server";

var application;
var oldCreateToken;

module('Acceptance: WelcomePaymentInfo', {
  setup: function() {
    application = startApp();
    oldCreateToken = mockStripe.card.createToken;
  },
  teardown: function() {
    Ember.run(application, 'destroy');
    mockStripe.card.createToken = oldCreateToken;
  }
});

test('visiting /welcome/payment-info when not logged in', function() {
  expectRequiresAuthentication('/welcome/payment-info');
});

test('submitting empty payment info raises an error', function() {
  mockStripe.card.createToken = function(options, fn) {
    setTimeout(function(){
      fn(422, { error: { message: 'Failure' } });
    }, 2);
  };

  stubOrganizations();

  signInAndVisit('/welcome/payment-info');
  click('button:contains(Save)');

  andThen(function() {
    equal(currentPath(), 'welcome.payment-info');
    var error = find('p:contains(Failure)');
    ok(error.length, 'errors are on the page');
  });
});

test('submitting valid payment info should be successful', function() {
  expect(8);
  // This is to load apps.index
  stubStacks();
  var name = 'Bob Boberson';
  var cardNumber = '4242424242424242';
  var cvc = '123';
  var expMonth = '03';
  var expYear = '2019';
  var addressZip = '11111';
  var stripeToken = 'some-token';

  stubRequest('post', '/organizations/1/subscriptions', function(request){
    var params = JSON.parse(request.requestBody);
    equal(params.stripe_token, stripeToken, 'stripe token is correct');
    return this.success();
  });

  stubOrganizations();

  mockStripe.card.createToken = function(options, fn) {
    equal(options.name, name, 'name is correct');
    equal(options.number, cardNumber, 'card number is correct');
    equal(options.cvc, cvc, 'cvc is correct');
    equal(options.exp_month, expMonth, 'exp month is correct');
    equal(options.exp_year, expYear, 'exp year is correct');
    equal(options.address_zip, addressZip, 'zip is correct');
    setTimeout(function(){
      fn(200, { id: stripeToken });
    }, 2);
  };

  signInAndVisit('/welcome/payment-info');
  fillIn('[name=name]', name);
  fillIn('[name=number]', cardNumber);
  fillIn('[name=cvc]', cvc);
  fillIn('[name=exp-month]', expMonth);
  fillIn('[name=exp-year]', expYear);
  fillIn('[name=zip]', addressZip);
  click('button:contains(Save)');

  andThen(function() {
    equal(currentPath(), 'stacks.stack.apps.index');
  });
});
