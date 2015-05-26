import { stubRequest } from "ember-cli-fake-server";
import successfulTokenResponse from './successful-token-response';
import Ember from 'ember';

export function signupInputsTest(url){
  visit(url);
  andThen(() => {
    expectInput('name');
    expectInput('email');
    expectInput('password');
    expectButton('Create account');
  });
}

export function doSignupSteps(url, userInput, options={}){
  let defaultInput = {
    name: 'bob', email: 'bob@gmail.com', password: 'abcDEF012!@#'
  };
  userInput = Ember.$.extend(true, defaultInput, userInput || {});
  let userUrl = '/users/user1';

  stubRequest('post', '/users', function(request){
    let params = this.json(request);
    equal(params.email, userInput.email, 'correct email is passed');
    equal(params.password, userInput.password, 'correct password is passed');
    return this.success({
      id: 'my-user',
      email: userInput.email
    });
  });

  stubRequest('post', '/tokens', function(request){
    let params = this.json(request);
    equal(params.username, userInput.email, 'correct email is passed');
    equal(params.password, userInput.password, 'correct password is passed');
    return successfulTokenResponse(this, userUrl);
  });

  stubRequest('get', userUrl, function(){
    return this.success({id: 'some-id', email: userInput.email});
  });

  visit(url);
  fillInput('name', userInput.name);
  fillInput('email', userInput.email);
  fillInput('password', userInput.password);

  if (options.clickButton !== false) {
    clickButton('Create account');
  }
}

export function paginatedResourceQueryParamsPage2Test(options){
  var resourceId = '1';
  var resourceUrl = '/' + options.resourceType + '/' + resourceId;
  var expectedHeader = options.expectedHeader;
  let stackId = 'stack-id';
  let stackHandle = 'stack-handle';
  let resourceHandle = 'resource-handle';

  var paginatedResourceUrl = resourceUrl + '/activity';
  var paginatedResourceApiUrl = resourceUrl + '/operations';

  stubRequest('get', resourceUrl, function(request){
    return this.success({
      id: resourceId,
      handle: resourceHandle,
      _links: { account: { href: `/accounts/${stackId}` } }
    });
  });

  stubStack({id: stackId, handle: stackHandle});

  stubRequest('get', paginatedResourceApiUrl, function(request){
    equal(request.queryParams.page, 2);

    return this.success({
      current_page: 2,
      per_page: 1,
      total_count: 2,
      _embedded: {
        operations: [{id: 'op-2', type: 'configure'}]
      }
    });
  });

  signInAndVisit(paginatedResourceUrl + '?page=2');
  andThen(function(){
    expectPaginationElements(
      {currentPage:2, prevEnabled:true, nextDisabled:true});
  });
}

export function paginatedResourceUpdatesQueryParamsTest(options){
  var resourceId = '1';
  var resourceUrl = '/' + options.resourceType + '/' + resourceId;
  var expectedHeader = options.expectedHeader;
  let stackHandle = 'stack-handle';
  let resourceHandle = 'resource-handle';

  var paginatedResourceUrl = resourceUrl + '/activity';
  var paginatedResourceApiUrl = resourceUrl + '/operations';
  let stackId = 'stack-id';

  stubRequest('get', resourceUrl, function(request){
    return this.success({
      id: resourceId,
      handle: resourceHandle,
      _links: { account: { href: `/accounts/${stackId}` } }
    });
  });

  stubStack({id: stackId, handle: stackHandle});

  stubRequest('get', paginatedResourceApiUrl, function(request){
    var page = parseInt(request.queryParams.page, 10);

    return this.success({
      current_page: page,
      per_page: 1,
      total_count: 2,
      _embedded: {
        operations: [ {id: 'op-' + page, type:'deploy'} ]
      }
    });
  });

  signInAndVisit(paginatedResourceUrl);

  andThen(function(){
    equal(currentURL(), paginatedResourceUrl);

    clickNextPageLink();
  });

  andThen(function(){
    equal(currentURL(), paginatedResourceUrl + '?page=2');
  });
}

export function resourceOperationsTest(options){
  var resourceId = '1';
  var resourceUrl = '/' + options.resourceType + '/' + resourceId;
  var expectedHeader = options.expectedHeader;
  let stackHandle = 'stack-handle';
  let resourceHandle = 'resource-handle';

  var paginatedResourceUrl = resourceUrl + '/activity';
  var paginatedResourceApiUrl = resourceUrl + '/operations';
  let stackId = 'stack-id';

  let isoCreatedAt = '2014-11-19T19:15:33.836Z';
  let utcTimeStamp = 'November 19, 2014 7:15PM UTC';

  stubRequest('get', resourceUrl, function(){
    return this.success({
      id: resourceId,
      handle: resourceHandle,
      _links: {
        operations: { href: paginatedResourceApiUrl },
        account: { href: `/accounts/${stackId}` }
      }
    });
  });

  stubStack({id: stackId, handle: stackHandle});

  stubRequest('get', paginatedResourceApiUrl, function(request){
    return this.success({
      current_page: 1,
      per_page: 20,
      total_count: 5*20,
      _embedded: {
        operations: [{
          id: 1,
          type: 'configure',
          status: 'succeeded',
          createdAt: isoCreatedAt,
          userName: 'Frank Macreery',
          userEmail: 'frank@aptible.com'
        }, {
          id: 2,
          type: 'deploy',
          status: 'succeeded',
          createdAt: isoCreatedAt,
          userName: 'Frank Macreery',
          userEmail: 'frank@aptible.com'
        }, {
          id: 3,
          type: 'execute',
          status: 'failed',
          createdAt: isoCreatedAt,
          userName: 'Frank Macreery',
          userEmail: 'frank@aptible.com'
        }]
      }
    });
  });

  signInAndVisit(paginatedResourceUrl);

  andThen(function(){
    var operationsContainer = find('.operations-list');
    var operations = find('.operation-item', operationsContainer);

    equal(operations.length, 3, 'has 3 operations');

    ok(find('.operation-type:contains(configured)').length,
      'has capitalized operation type: Configured');

    ok(find('.operation-type:contains(deployed)').length,
      'has capitalized operation type: Deployed');

    ok(find('.operation-type:contains(SSHed)').length, 'converts execute to SSH');

    ['succeeded', 'failed'].forEach(function(type){
      ok(find('.operation-icon .status-'+ type).length,
         'has colorized status icon: status-' + type);
    });

    var operationCreatedBy = find('.operation-author:contains(Frank Macreery)');
    ok(operationCreatedBy.length, 'has operation created by username');

    var operationCreatedAt = find(`.operation-date:contains(${utcTimeStamp})`);
    ok( operationCreatedAt.length, 'displays UTC formatted timestamp' );

    expectPaginationElements();
    expectTitle(`${resourceHandle} Activity - ${stackHandle}`);
  });
}

export function paginatedResourceTest(options){
  var resourceId = '1';
  var resourceUrl = '/' + options.resourceType + '/' + resourceId;
  var expectedHeader = options.expectedHeader;
  let stackId = 'stack-id';
  let stackHandle = 'stack-handle';
  let resourceHandle = 'resource-handle';

  var paginatedResourceUrl = resourceUrl + '/activity';
  var paginatedResourceApiUrl = resourceUrl + '/operations';

  var requestNum = 0;

  var ops = [
    {id: 1, type: 'configure'},
    {id: 2, type: 'deploy'},
  ];
  var orderedResponses = [
    {page: 1, op: ops[0] },
    {page: 2, op: ops[1] },
    {page: 1, op: ops[0] }
  ];

  expect(orderedResponses.length + 6);

  stubRequest('get', resourceUrl, function(request){
    return this.success({
      id: resourceId,
      handle: resourceHandle,
      _links: { account: { href: `/accounts/${stackId}` } }
    });
  });

  stubStack({id: stackId, handle: stackHandle});

  stubRequest('get', paginatedResourceApiUrl, function(request){
    requestNum++;

    if (requestNum > orderedResponses.length) {
      ok(false, 'Too many requests: ' + requestNum);
    }

    var response = orderedResponses[ requestNum - 1];
    equal(request.queryParams.page, response.page, 'request #' + requestNum + ' has correct page');

    return this.success({
      current_page: response.page,
      per_page: 1,
      total_count: ops.length,
      _embedded: {
        operations: [ response.op ]
      }
    });
  });

  var capitalize = Ember.String.capitalize;

  signInAndVisit(paginatedResourceUrl);

  andThen(function(){
    ok(find('.operation-type:contains(' + ops[0].type + ')').length,
       'has operation from page 1');
    ok(!find('.operation-type:contains(' + ops[1].type + ')').length,
       'has no operation from page 2');
  });

  clickNextPageLink();

  andThen(function(){
    ok(find('.operation-type:contains(' + ops[1].type + ')').length,
       'has operation from page 2');
    ok(!find('.operation-type:contains(' + ops[0].type + ')').length,
       'has no operation from page 1');
  });

  clickPrevPageLink();

  andThen(function(){
    ok(find('.operation-type:contains(' + ops[0].type + ')').length,
       'has operation from page 1');
    ok(!find('.operation-type:contains(' + ops[1].type + ')').length,
       'has no operation from page 2');
  });
}
