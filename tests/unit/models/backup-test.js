import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';
import modelDeps from '../../support/common-model-dependencies';

moduleForModel('backup', 'model:backup', {
  needs: modelDeps.concat([
    'adapter:backup'
  ])
});

test('store.find("backup", {database:database, page:page}) formats the URL correctly"', function(assert) {
  assert.expect(4);

  const store = this.store();
  let db;
  let firstRequest = true;

  stubRequest('get', '/databases/db-id/backups', function(request){
    if (firstRequest) {
      firstRequest = false;
      assert.equal(request.queryParams.page, "1", "first request has page=1 query param");

      return this.success({
        page: 1,
        total_pages: 2,
        _embedded: {
          operations: [{id:'backup-1'}]
        }
      });
    } else {
      assert.equal(request.queryParams.page, "2", "second request has page=2 query param");

      return this.success({
        page: 2,
        total_pages: 2,
        _embedded: {
          operations: [{id:'backup-2'}]
        }
      });
    }
  });

  return Ember.run(function(){
    db = store.push('database', {id: 'db-id'});

    return store.find('backup', {database: db, page: 1}).then(() => {
      assert.deepEqual(store.metadataFor('backup'),
                {page:1, total_pages:2}, 'store has correct metadata first time');

      return store.find('backup', {database: db, page: 2});
    }).then(() => {
      assert.deepEqual(store.metadataFor('backup'),
                {page: 2, total_pages: 2}, 'store has correct metadata second time');
    });
  });
});
