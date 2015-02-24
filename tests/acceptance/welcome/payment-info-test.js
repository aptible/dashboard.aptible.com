import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { mockStripe } from '../../helpers/mock-stripe';
import { stubRequest } from "../../helpers/fake-server";

var application;
var oldCreateToken;

function visitPaymentInfoWithApp(options, userData){
  signInAndVisit('/welcome/first-app', userData);
  if (options) {
    if (options.dbType) {
      click(`.${options.dbType} a`);
    }
    for (var prop in options){
      let dasherized = prop.dasherize();
      if (dasherized === 'db-type') {
        continue;
      }
      fillIn(`input[name="${dasherized}"]`, options[prop]);
    }
    click('button:contains(Get Started)');
  } else {
    click('a:contains(Skip this step)');
  }
}

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

  visitPaymentInfoWithApp();
  click('button:contains(Save)');

  andThen(function() {
    equal(currentPath(), 'welcome.payment-info');
    var error = find('p:contains(Failure)');
    ok(error.length, 'errors are on the page');
  });
});

test('submitting valid payment info should be successful', function() {
  expect(11);
  // This is to load apps.index
  stubStacks();
  stubOrganization();
  var name = 'Bob Boberson';
  var cardNumber = '4242424242424242';
  var cvc = '123';
  var expMonth = '03';
  var expYear = '2019';
  var addressZip = '11111';
  var stripeToken = 'some-token';
  var stackHandle = 'sprocket-co';
  var appHandle = 'my-app-1';

  stubRequest('post', '/organizations/1/subscriptions', function(request){
    var params = this.json(request);
    equal(params.stripe_token, stripeToken, 'stripe token is correct');
    return this.success();
  });

  let stackAssertions = {};

  stackAssertions[`${stackHandle}-dev`] = (params) => {
    ok(true, 'stack handle is correct');
    equal(params.type, 'development', 'stack type is correct');
    stackAssertions[params.handle] = null;
  };

  stubRequest('post', '/accounts', function(request){
    var params = this.json(request);
    equal(params.organization_url, '/organizations/1', 'organization url is correct');
    stackAssertions[params.handle](params);
    return this.success({
      id: stackHandle,
      handle: stackHandle,
      type: 'development'
    });
  });

  stubOrganizations();
  stubDatabases([]);

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

  visitPaymentInfoWithApp();
  fillIn('[name=name]', name);
  fillIn('[name=number]', cardNumber);
  fillIn('[name=cvc]', cvc);
  fillIn('[name=exp-month]', expMonth);
  fillIn('[name=exp-year]', expYear);
  fillIn('[name=zip]', addressZip);
  click('button:contains(Save)');

  andThen(function() {
    equal(currentPath(), 'stacks.index');
  });
});

test('submitting valid payment info for production plan should be successful', function() {
  expect(14);
  // This is to load apps.index
  stubStacks();
  stubOrganization();
  var name = 'Bob Boberson';
  var cardNumber = '4242424242424242';
  var cvc = '123';
  var expMonth = '03';
  var expYear = '2019';
  var addressZip = '11111';
  var stripeToken = 'some-token';
  var stackHandle = 'sprocket-co';
  var appHandle = 'my-app-1';

  stubRequest('post', '/organizations/1/subscriptions', function(request){
    var params = this.json(request);
    equal(params.stripe_token, stripeToken, 'stripe token is correct');
    return this.success();
  });

  let stackAssertions = {};

  stackAssertions[`${stackHandle}-dev`] = (params) => {
    ok(true, 'stack handle is correct');
    equal(params.type, 'development', 'stack type is correct');
    stackAssertions[params.handle] = null;
  };

  stackAssertions[`${stackHandle}-prod`] = (params) => {
    ok(true, 'stack handle is correct');
    equal(params.type, 'production', 'stack type is correct');
    stackAssertions[params.handle] = null;
  };

  stubRequest('post', '/accounts', function(request){
    var params = this.json(request);
    equal(params.organization_url, '/organizations/1', 'organization url is correct');
    stackAssertions[params.handle](params);
    return this.success({
      id: stackHandle,
      handle: stackHandle,
      type: 'development'
    });
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

  visitPaymentInfoWithApp();
  fillIn('[name=name]', name);
  fillIn('[name=number]', cardNumber);
  fillIn('[name=cvc]', cvc);
  fillIn('[name=exp-month]', expMonth);
  fillIn('[name=exp-year]', expYear);
  fillIn('[name=zip]', addressZip);
  fillIn('[name=plan]', 'production');
  click('button:contains(Save)');

  andThen(function() {
    equal(currentPath(), 'stacks.index');
  });
});

test('submitting valid payment info should be successful and create app', function() {
  expect(9);
  // This is to load apps.index
  stubStacks();
  stubOrganization();
  var name = 'Bob Boberson';
  var cardNumber = '4242424242424242';
  var cvc = '123';
  var expMonth = '03';
  var expYear = '2019';
  var addressZip = '11111';
  var stripeToken = 'some-token';
  var stackHandle = 'sprocket-co';
  var appHandle = 'my-app-1';

  stubRequest('post', '/organizations/1/subscriptions', function(request){
    var params = this.json(request);
    equal(params.stripe_token, stripeToken, 'stripe token is correct');
    return this.success();
  });

  stubRequest('post', '/accounts', function(request){
    var params = this.json(request);
    return this.success({
      id: params.handle,
      handle: params.handle,
      type: params.type
    });
  });

  stubRequest('post', `/accounts/${stackHandle}-dev/apps`, function(request){
    var params = this.json(request);
    equal(params.handle, appHandle, 'app handle is correct');
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

  visitPaymentInfoWithApp({
    appHandle: appHandle
  });
  fillIn('[name=name]', name);
  fillIn('[name=number]', cardNumber);
  fillIn('[name=cvc]', cvc);
  fillIn('[name=exp-month]', expMonth);
  fillIn('[name=exp-year]', expYear);
  fillIn('[name=zip]', addressZip);
  click('button:contains(Save)');

  andThen(function() {
    equal(currentPath(), 'stacks.index');
  });
});

test('submitting valid payment info should be successful and create db', function() {
  expect(10);
  // This is to load apps.index
  stubStacks();
  stubOrganization();
  var name = 'Bob Boberson';
  var cardNumber = '4242424242424242';
  var cvc = '123';
  var expMonth = '03';
  var expYear = '2019';
  var addressZip = '11111';
  var stripeToken = 'some-token';
  var stackHandle = 'sprocket-co';
  var dbHandle = 'my-db-1';
  var dbType = 'redis';

  stubRequest('post', '/organizations/1/subscriptions', function(request){
    var params = this.json(request);
    equal(params.stripe_token, stripeToken, 'stripe token is correct');
    return this.success();
  });

  stubRequest('post', '/accounts', function(request){
    var params = this.json(request);
    return this.success({
      id: params.handle,
      handle: params.handle,
      type: params.type
    });
  });

  stubRequest('post', `/accounts/${stackHandle}-dev/databases`, function(request){
    var params = this.json(request);
    equal(params.handle, dbHandle, 'db handle is correct');
    equal(params.type, dbType, 'db type is correct');
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

  visitPaymentInfoWithApp({
    dbHandle: dbHandle,
    dbType: dbType
  });
  fillIn('[name=name]', name);
  fillIn('[name=number]', cardNumber);
  fillIn('[name=cvc]', cvc);
  fillIn('[name=exp-month]', expMonth);
  fillIn('[name=exp-year]', expYear);
  fillIn('[name=zip]', addressZip);
  click('button:contains(Save)');

  andThen(function() {
    equal(currentPath(), 'stacks.index');
  });
});

test('submitting valid payment info when user is verified should provision db', function() {
  expect(12);
  // This is to load apps.index
  stubStacks();
  stubOrganization();
  var name = 'Bob Boberson';
  var cardNumber = '4242424242424242';
  var cvc = '123';
  var expMonth = '03';
  var expYear = '2019';
  var addressZip = '11111';
  var stripeToken = 'some-token';
  var stackHandle = 'sprocket-co';
  var dbHandle = 'my-db-1';
  var dbType = 'redis';
  let dbId = 'db-id';

  stubRequest('post', '/organizations/1/subscriptions', function(request){
    var params = this.json(request);
    equal(params.stripe_token, stripeToken, 'stripe token is correct');
    return this.success();
  });

  stubRequest('post', '/accounts', function(request){
    var params = this.json(request);
    return this.success({
      id: params.handle,
      handle: params.handle,
      type: params.type
    });
  });

  stubRequest('post', `/accounts/${stackHandle}-dev/databases`, function(request){
    var params = this.json(request);
    equal(params.handle, dbHandle, 'db handle is correct');
    equal(params.type, dbType, 'db type is correct');
    return this.success({
      id: dbId
    });
  });

  stubDatabases([{id:dbId}]);

  stubRequest('post', `/databases/${dbId}/operations`, function(request){
    ok(true, 'POSTs to create db provision operation');
    let json = this.json(request);
    equal(json.type, 'provision');

    return this.success(201, {
      id: 'op-id',
      type: json.type
    });
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

  let userData = {id: 'user-id', verified: true};
  visitPaymentInfoWithApp({
    dbHandle: dbHandle,
    dbType: dbType
  }, userData);
  fillIn('[name=name]', name);
  fillIn('[name=number]', cardNumber);
  fillIn('[name=cvc]', cvc);
  fillIn('[name=exp-month]', expMonth);
  fillIn('[name=exp-year]', expYear);
  fillIn('[name=zip]', addressZip);
  click('button:contains(Save)');

  andThen(function() {
    equal(currentPath(), 'stacks.index');
  });
});
