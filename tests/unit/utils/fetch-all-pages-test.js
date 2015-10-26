import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from 'ember-cli-fake-server';
import Ember from "ember";
import fetchAllPages from "dummy/utils/fetch-all-pages";

let store;

moduleForModel('app', 'Utils - fetch-all-pages', {
  integration: true,

  setup: function(){
    store = this.container.lookup('store:main');

  },

  teardown: function(){
    Ember.run(store, 'destroy');
  }
});

function buildAppPage(page, {perPage, totalCount }) {
  let apps = [];
  for (let i = 0; i < perPage; i++) {
    apps.push({
      id: `${page} - ${i}`,
      handle: `my-app-${page}-${i}-stack-1`,
      status: 'provisioned',
      _embedded: {
        services: [{
          id: page + '',
          handle: `the-service-${i}`,
          container_count: 1
        }]
      },
      _links: {
        account: { href: '/accounts/my-stack-1'}
      }
    });
  }

  return {
    _links: {},
    _embedded: {
      apps
    },
    current_page: page,
    per_page: perPage,
    total_count: totalCount
  };
}

function stubAccounts() {
  stubRequest('get', '/accounts', function(){
    return this.success({
      _links: {},
      _embedded: {
        accounts: [{
          _links: {
            self: { href: '/accounts/my-stack-1' },
            apps: { href: '/accounts/my-stack-1/apps' },
            databases: { href: '/accounts/my-stack-1/databases' },
            organization: { href: '/organizations/1' }
          },
          _embedded: {},
          id: 'my-stack-1',
          handle: 'my-stack-1',
          activated: true
        }]
      }
    });
  });
}

test('requests all records based on pagination metadata; 1 per page', function(assert) {
  assert.expect(4);

  stubAccounts();

  let nextPage = 1;
  stubRequest('get', '/accounts/my-stack-1/apps', function(request){
    let requestedPage = request.queryParams.page || 1;  // default to 1 since initial request doesn't include `page`

    assert.equal(requestedPage, nextPage++);

    return this.success(buildAppPage(requestedPage, { perPage: 1, totalCount: 3 }));
  });

  return store.find('stack')
    .then((stacks) => {
      let stack = stacks.get('firstObject');

      return fetchAllPages(store, stack, 'app');
    })
    .then((apps) => {
      assert.equal(apps.get('length'), 3);
    });
});

test('requests all records based on pagination metadata; many per page', function(assert) {
  assert.expect(4);

  stubAccounts();

  let nextPage = 1;
  stubRequest('get', '/accounts/my-stack-1/apps', function(request){
    let requestedPage = request.queryParams.page || 1;  // default to 1 since initial request doesn't include `page`

    assert.equal(requestedPage, nextPage++);

    return this.success(buildAppPage(requestedPage, { perPage: 5, totalCount: 15 }));
  });

  return store.find('stack')
    .then((stacks) => {
      let stack = stacks.get('firstObject');

      return fetchAllPages(store, stack, 'app');
    })
    .then((apps) => {
      assert.equal(apps.get('length'), 15);
    });
});
