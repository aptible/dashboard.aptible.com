import { stubRequest } from '../helpers/fake-server';

export function paginatedResourceQueryParamsPage2Test(options){
  var resourceId = '1';
  var resourceUrl = '/' + options.resourceType + '/' + resourceId;

  var paginatedResourceUrl = resourceUrl + '/operations';

  stubRequest('get', resourceUrl, function(request){
    return this.success({ id: resourceId });
  });

  stubRequest('get', paginatedResourceUrl, function(request){
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

  var paginatedResourceUrl = resourceUrl + '/operations';

  stubRequest('get', resourceUrl, function(request){
    return this.success({ id: resourceId });
  });

  stubRequest('get', paginatedResourceUrl, function(request){
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

  var paginatedResourceUrl = resourceUrl + '/operations';

  stubRequest('get', resourceUrl, function(request){
    return this.success({ id: resourceId });
  });

  stubRequest('get', paginatedResourceUrl, function(request){
    return this.success({
      current_page: 1,
      per_page: 20,
      total_count: 5*20,
      _embedded: {
        operations: [{
          id: 1,
          type: 'configure',
          status: 'succeeded',
          createdAt: '2014-11-19T00:15:33.836Z',
          userName: 'Frank Macreery',
          userEmail: 'frank@aptible.com'
        }, {
          id: 2,
          type: 'deploy',
          status: 'succeeded',
          createdAt: '2014-11-19T00:15:33.836Z',
          userName: 'Frank Macreery',
          userEmail: 'frank@aptible.com'
        }, {
          id: 3,
          type: 'execute',
          status: 'failed',
          createdAt: '2014-11-19T00:15:33.836Z',
          userName: 'Frank Macreery',
          userEmail: 'frank@aptible.com'
        }]
      }
    });
  });

  signInAndVisit(paginatedResourceUrl);

  andThen(function(){
    var header = find('header:contains(' + expectedHeader + ')');
    ok(header.length, 'has header');

    var operationsContainer = find('.operations');
    var operations = find('.operation', operationsContainer);

    equal(operations.length, 3, 'has 3 operations');

    ['Configure', 'Deploy', 'Execute'].forEach(function(type){
      ok(find('.operation-type:contains(' + type + ')').length,
         'has capitalized operation type: ' + type);
    });

    ['Succeeded', 'Failed'].forEach(function(type){
      ok(find('.operation-status:contains(' + type + ')').length,
         'has capitalized operation status: ' + type);
    });

    var operationCreatedBy = find('.operation-created-by:contains(Frank Macreery)');
    ok(operationCreatedBy.length, 'has operation created by username');

    expectPaginationElements();
  });
}

export function paginatedResourceTest(options){
  var resourceId = '1';
  var resourceUrl = '/' + options.resourceType + '/' + resourceId;

  var paginatedResourceUrl = resourceUrl + '/operations';
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

  expect(orderedResponses.length);

  stubRequest('get', resourceUrl, function(request){
    return this.success({
      id: resourceId
    });
  });

  stubRequest('get', paginatedResourceUrl, function(request){
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

  signInAndVisit(paginatedResourceUrl);
  clickNextPageLink();
  clickPrevPageLink();
}
