import Ember from 'ember';
import {module, test} from 'qunit';
import startApp from '../../helpers/start-app';
import { stubRequest } from '../../helpers/fake-server';

var App;
let url = '/stacks/my-stack-1/certificates/new';
let appIndexUrl = '/stacks/my-stack-1/certificates';
let stackId = 'my-stack-1';
let stackHandle = 'my-stack-1';

module('Acceptance: Certificate Create', {
  beforeEach: function() {
    App = startApp();
    stubStacks();
    stubStack({
      id: stackId,
      handle: stackHandle,
      _links: {
        certificates: { href: `/accounts/${stackId}/certificates` },
        organization: { href: '/organizations/1' }
      }
    });
    stubOrganization();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test(`${url} requires authentication`, function(assert) {
  expectRequiresAuthentication(url);
});