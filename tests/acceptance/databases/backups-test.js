import Ember from 'ember';
import startApp from '../../helpers/start-app';
import { stubRequest } from 'diesel/tests/helpers/fake-server';

let App;
let jqTransitionSupport;

const databaseId = "1",
      databaseHandle = "my-db-handle",
      stackHandle = "my-stack-handle",
      stackId = "my-stack-id",
      backupsPage = `/databases/${databaseId}/backups`,
      databaseUrl = `/databases/${databaseId}`,
      backupsIndexUrl = `${databaseUrl}/backups`;

const stack = {
  id: stackId,
  handle: stackHandle
};

const database = {
  id: databaseId,
  handle: databaseHandle,
  _links: {
    account: { href: `/accounts/${stackId}` } 
  }
};

module('Acceptance: Databases Backups', {
  beforeEach: function() {
    // TODO: Should we disable jQuery transitions for all tests (in test-helper.js)?
    jqTransitionSupport = $.support.transition;
    $.support.transition = false;
    App = startApp();
    stubStacks();
    stubOrganizations();
    stubStack(stack);
    stubDatabase(database);
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
    $.support.transition = jqTransitionSupport;
  }
});

test(`visit ${backupsPage} requires authentication`, function() {
  expectRequiresAuthentication(backupsPage);
});

test(`visit ${backupsPage} shows a paginated list of backups`, function(assert) {
  assert.expect(6);

  const backups = [
    { id: 3, created_at: '2016-06-13T13:13:13.005Z', aws_region: 'us-east-1' },
    { id: 2, created_at: '2016-06-12T12:12:12.005Z', aws_region: 'us-east-1' },
    { id: 1, created_at: '2016-06-11T11:11:11.005Z', aws_region: 'us-east-1' },
    { id: 0, created_at: '2016-06-10T10:10:10.005Z', aws_region: 'us-east-1' }  // TODO - Copies
  ];
  const apiResponses = { 1: [backups[0], backups[1]], 2: [backups[2], backups[3]] };

  stubRequest("get", backupsIndexUrl, function(request) {
    const page = request.queryParams.page;
    const apiResponse = apiResponses[page];
    assert.ok(apiResponse, `Query for page ${page} is valid`);

    return this.success({
      current_page: parseInt(page, 10),  // page is otherwise a string
      per_page: 2,
      total_count: backups.length,
      _embedded: {
        backups: apiResponse
      }
    });
  });

  // TODO: Check why copies trigger a reload..
  signInAndVisit(backupsPage);

  andThen(() => {
    const firstBackupCell = find('.panel-heading:contains(June 13, 2016 1:13PM UTC)');
    assert.ok(firstBackupCell.length, 'First backup is shown');

    const secondBackupCell = find('.panel-heading:contains(June 12, 2016 12:12PM UTC)');
    assert.ok(secondBackupCell.length, 'Second backup is shown');
  });

  andThen(() => {
    clickButton("Older items");
  });

  andThen(() => {
    const thirdBackupCell = find('.panel-heading:contains(June 11, 2016 11:11AM UTC)');
    assert.ok(thirdBackupCell.length, 'Third backup is shown');

    const fourthBackupCell = find('.panel-heading:contains(June 10, 2016 10:10AM UTC)');
    assert.ok(fourthBackupCell.length, 'Fourth backup is shown');
  });
});

test(`visit ${backupsPage} allows creating a new backup`, function(assert) {
  assert.expect(4);

  let operationGetHits = 0;
  const operationId = 'my-op-id';

  stubRequest("post", `${databaseUrl}/operations`, function(request) {
    const json = this.json(request);
    assert.equal(json.type, "backup");

    return this.success({
      id: operationId,
      type: json.type,
      status: 'queued'
    });
  });

  stubRequest("get", `/operations/${operationId}`, function() {
    return this.success({
      id: operationId,
      status: ++operationGetHits > 1 ? 'succeeded' : 'running'
    });
  });

  let backupGetHits = 0;

  stubRequest("get", backupsIndexUrl, function() {
    backupGetHits++;
    return this.success({ _embedded: { backups: [] }});
  });

  signInAndVisit(backupsPage);

  andThen(() => {
    assert.equal(backupGetHits, 1, 'Backups are hit once before creating a new backup');
    clickButton("Create New Backup");
  });

  andThen(() => {
    assert.equal(operationGetHits, 2, 'Operation reloads until succeeded');
    assert.equal(backupGetHits, 2, 'Backups are reloaded once operation succeeds');
  });
});

test(`visit ${backupsPage} shows restore instructions`, function(assert) {
  assert.expect(3);

  const backups = [
    { id: 1, created_at: '2016-06-13T13:13:13.005Z', aws_region: 'us-west-1',
      _links: { copied_from: { href: '/backups/0' }}},
    { id: 0, created_at: '2016-06-12T12:12:12.005Z', aws_region: 'us-east-1',
      _links: { self: { href: '/backups/0' }}}
  ];

  stubRequest("get", backupsIndexUrl, function() {
    return this.success({
      current_page: 1,
      per_page: backups.length,
      total: backups.length,
      _embedded: { backups: backups }
    });
  });

  signInAndVisit(backupsPage);

  let original;
  let copy;
  const restoreLabel = "Restore to a New Database";
  const restorePopover = '.popover:contains(aptible backup:restore 0)';

  andThen(() => {
    original = find('.panel:contains(June 12, 2016 12:12PM UTC)');
    copy = find('.panel:contains(June 13, 2016 1:13PM UTC)');
    clickButton(restoreLabel, { context: original });
  });

  andThen(() => {
    assert.ok(find(restorePopover).length, 'Restore popover is shown for original');
    clickButton(restoreLabel, { context: original });
  });

  andThen(() => {
    assert.ok(!find(restorePopover).length, 'Restore popover is hidden');
    clickButton(restoreLabel, { context: copy });
  });

  andThen(() => {
    // This should still show the original's ID because the copy is a copy!
    assert.ok(find(restorePopover).length, 'Restore popover is shown for copy');
  });
});
