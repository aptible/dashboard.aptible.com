import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { mockStripe } from '../../helpers/mock-stripe';
import { stubRequest } from '../../helpers/fake-server';

let application;
let oldCreateToken;
let url = '/welcome/first-app';
let claimUrls = ['/claims/user', '/claims/account', '/claims/app', '/claims/database'];

function visitPaymentInfoWithApp(options, userData){
  userData = userData || {};
  options = options || {};
  if (userData.verified === undefined) { userData.verified = false; }

  signInAndVisit(url, userData);
  andThen(function(){
    if (options.dbType) {
      click(`.${options.dbType} a`);
    }
    if (options.dbInitialDiskSize) {
      triggerSlider('.slider', options.dbInitialDiskSize);
    }
    for (var prop in options){
      let dasherized = prop.dasherize();

      // non-fillIn-able inputs
      if ('db-type db-initial-disk-size'.w().indexOf(dasherized) !== -1) {
        continue;
      }
      fillInput(dasherized, options[prop]);
    }
    clickButton('Get Started');
  });
}

function mockSuccessfulPayment(stripeToken){
  mockStripe.card.createToken = function(options, fn) {
    setTimeout(function(){
      fn(200, { id: stripeToken || 'mocked-stripe-token' });
    }, 2);
  };

  stubRequest('post', '/organizations/:org_id/subscriptions', function(request){
    return this.success();
  });
}

module('Acceptance: WelcomePaymentInfo', {
  setup: function() {
    application = startApp();
    oldCreateToken = mockStripe.card.createToken;

    claimUrls.forEach((claimUrl) => {
      stubRequest('post', claimUrl, function(request) {
        return [204, {}, ''];
      });
    });
  },
  teardown: function() {
    Ember.run(application, 'destroy');
    mockStripe.card.createToken = oldCreateToken;
  }
});

test('visiting /welcome/payment-info when not logged in', function() {
  expectRequiresAuthentication('/welcome/payment-info');
});

test('visiting /welcome/payment-info logged in with stacks', function() {
  stubStacks();
  stubOrganizations();
  stubOrganization();
  signInAndVisit('/welcome/payment-info');

  andThen(function() {
    equal(currentPath(), 'dashboard.stack.apps.index');
  });
});

test('submitting empty payment info raises an error', function() {
  mockStripe.card.createToken = function(options, fn) {
    setTimeout(function(){
      fn(422, { error: { message: 'Failure' } });
    }, 2);
  };

  stubStacks({}, []);
  stubOrganizations();

  visitPaymentInfoWithApp();
  clickButton('Save');

  andThen(function() {
    equal(currentPath(), 'welcome.payment-info');
    let error = find('p:contains(Failure)');
    ok(error.length, 'errors are on the page');
  });
});

test('payment info should be submitted to stripe to create stripeToken', function() {
  expect(8);

  stubStacks({}, []);
  // This is to load apps.index
  stubOrganization();
  let cardOptions = {
    name: 'Bob Boberson',
    cardNumber: '4242424242424242',
    cvc: '123',
    expMonth: '03',
    expYear: '2019',
    addressZip: '11111'
  };
  let stripeToken = 'some-token';
  let stackHandle = 'my-stack-1';
  let appHandle = 'my-app-1-stack-1';

  stubRequest('post', '/organizations/1/subscriptions', function(request){
    var params = this.json(request);
    equal(params.stripe_token, stripeToken, 'stripe token is submitted');
    return this.success();
  });

  let stackAssertions = {};

  stubRequest('post', '/accounts', function(request){
    return this.success({
      id: stackHandle,
      handle: stackHandle,
      type: 'development',
      activated: true
    });
  });

  stubOrganizations();

  mockStripe.card.createToken = function(options, fn) {
    equal(options.name, cardOptions.name, 'name is correct');
    equal(options.number, cardOptions.cardNumber, 'card number is correct');
    equal(options.cvc, cardOptions.cvc, 'cvc is correct');
    equal(options.exp_month, cardOptions.expMonth, 'exp month is correct');
    equal(options.exp_year, cardOptions.expYear, 'exp year is correct');
    equal(options.address_zip, cardOptions.addressZip, 'zip is correct');
    setTimeout(function(){
      fn(200, { id: stripeToken });
    }, 2);
  };

  visitPaymentInfoWithApp();
  andThen(function(){
    stubStacks();
  });
  fillInput('name', cardOptions.name);
  fillInput('number', cardOptions.cardNumber);
  fillInput('cvc', cardOptions.cvc);
  fillInput('exp-month', cardOptions.expMonth);
  fillInput('exp-year', cardOptions.expYear);
  fillInput('zip', cardOptions.addressZip);
  clickButton('Save');
  andThen( () => {
    equal(currentPath(), 'dashboard.stack.apps.index');
  });
});

test('submitting valid payment info for development plan should create dev stack', function() {
  expect(4);

  stubStacks({}, []);
  // This is to load apps.index
  stubOrganization();

  let stackHandle = 'sprocket-co';
  let appHandle = 'my-app-1';

  let stackAssertions = {};

  stackAssertions[stackHandle] = (params) => {
    ok(true, 'stack handle is correct');
    equal(params.organization_url, '/organizations/1', 'correct organization_url is posted');
    equal(params.type, 'development', 'stack type is correct');
    stackAssertions[params.handle] = null;
  };

  stackAssertions[`${stackHandle}-prod`] = (params) => {
    ok(false, 'should not create prod stack');
  };

  stubRequest('post', '/accounts', function(request){
    var params = this.json(request);
    stackAssertions[params.handle](params);
    params.activated = true;
    return this.success(Ember.merge({id:params.handle }, params));
  });

  stubOrganizations();
  mockSuccessfulPayment();

  visitPaymentInfoWithApp();
  andThen(function(){
    stubStacks();
  });

  clickButton('Save');
  andThen( () => {
    equal(currentPath(), 'dashboard.stack.apps.new');
  });
});

test('submitting valid payment info on organization with existing stripe info should not recreate the subscription', function() {
  stubStacks({}, []);
  stubOrganization();

  stubRequest('post', '/accounts', function(request) {
    var params = this.json(request);
    params.activated = true;
    return this.success(Ember.merge({id:params.handle }, params));
  });

  stubRequest('post', '/organizations/:org_id/subscriptions', function(request){
    ok(false, 'should not create subscription again');
    return this.success();
  });

  stubRequest('get', '/organizations', function(request){
    return this.success({
      _links: {},
      _embedded: {
        organizations: [{
          _links: {
            self: { href: '/organizations/1' }
          },
          id: 1, name: 'Sprocket Co', type: 'organization',
          stripe_subscription_id: 'sub_xxx', stripe_customer_id: 'cus_xxx'
        }]
      }
    });
  });

  let stackHandle = 'sprocket-co';

  mockStripe.card.createToken = function(options, fn) {
    setTimeout(function(){
      fn(200, { id: 'mocked-stripe-token' });
    }, 2);
  };

  visitPaymentInfoWithApp({ stackHandle: stackHandle });

  andThen(function() {
    stubStacks();
  });

  clickButton('Save');

  andThen(function() {
    equal(currentPath(), 'dashboard.stack.apps.new');
  });
});

test('submitting valid payment info should create app', function() {
  expect(2);
  stubStacks({}, []);
  // This is to load apps.index
  stubOrganization();
  let stackHandle = 'sprocket-co';
  let appHandle = 'my-app-1';


  stubRequest('post', '/accounts', function(request){
    var params = this.json(request);
    params.activated = true;
    return this.success(Ember.merge({id:params.handle}, params));
  });

  stubRequest('post', `/accounts/${stackHandle}/apps`, function(request){
    var params = this.json(request);
    equal(params.handle, appHandle, 'app handle is correct');
    return this.success({id: appHandle, handle: appHandle});
  });

  stubRequest('get', `/apps/${appHandle}`, function() {
    return this.success({ id: appHandle, handle: appHandle });
  });

  stubOrganizations();
  mockSuccessfulPayment();

  visitPaymentInfoWithApp({appHandle: appHandle});
  andThen(function(){
    stubStacks();
  });
  clickButton('Save');
  andThen(function() {
    equal(currentPath(), 'dashboard.stack.apps.index');
  });
});

test('submitting valid payment info should create db', function() {
  expect(4);

  stubStacks({}, []);
  // This is to load apps.index
  stubOrganization();
  let stackHandle = 'sprocket-co';
  let dbHandle = 'my-db-1';
  let dbType = 'redis';
  let dbInitialDiskSize = '67';

  stubRequest('post', '/accounts', function(request){
    var params = this.json(request);
    params.activated = true;
    return this.success(Ember.merge({id:params.handle}, params));
  });

  stubRequest('post', `/accounts/${stackHandle}/databases`, function(request){
    var params = this.json(request);
    equal(params.handle, dbHandle, 'db handle is correct');
    equal(params.initial_disk_size, dbInitialDiskSize, 'disk size is correct');
    equal(params.type, dbType, 'db type is correct');
    return this.success({id: dbHandle});
  });

  stubOrganizations();
  mockSuccessfulPayment();

  visitPaymentInfoWithApp({
    dbHandle: dbHandle,
    dbType: dbType,
    dbInitialDiskSize: dbInitialDiskSize
  });
  andThen(function(){
    stubStacks();
  });
  clickButton('Save');
  andThen(function() {
    equal(currentPath(), 'dashboard.stack.apps.new');
  });
});

test('submitting valid payment info when user is verified should provision db', function() {
  expect(4);

  stubStacks({}, []);
  // This is to load apps.index
  stubOrganization();
  var stackHandle = 'sprocket-co';
  var dbHandle = 'my-db-1';
  var dbType = 'redis';
  let dbId = 'db-id';
  let opType = 'provision';

  let databaseParams = {};
  let operationsParams = {};

  stubRequest('post', '/accounts', function(request){
    let params = this.json(request);
    params.activated = true;
    return this.success(Ember.merge({id:params.handle},params));
  });

  stubRequest('post', `/accounts/${stackHandle}/databases`, function(request){
    databaseParams = this.json(request);
    return this.success({id: dbId});
  });

  // provisionDatabases must GET all dbs to provision them
  stubDatabases([{id:dbId}]);

  stubRequest('post', `/databases/${dbId}/operations`, function(request){
    operationsParams = this.json(request);
    return this.success(201, {id: 'op-id'});
  });

  stubOrganizations();
  mockSuccessfulPayment();

  let userData = {id: 'user-id', verified: true};
  visitPaymentInfoWithApp({
    dbHandle: dbHandle,
    dbType: dbType
  }, userData);
  andThen(function(){
    stubStacks();
  });
  clickButton('Save');
  andThen(function() {
    equal(currentPath(), 'dashboard.stack.apps.new');

    equal(databaseParams.handle, dbHandle,
          'db params has handle');
    equal(databaseParams.type, dbType,
          'db params has type');
    equal(operationsParams.type, opType,
          'op params has type');
  });
});
