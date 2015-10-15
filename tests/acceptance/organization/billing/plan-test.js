import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'diesel/tests/helpers/start-app';
import { stubRequest } from 'ember-cli-fake-server';
import { didTrackEventWith } from 'diesel/tests/helpers/mock-analytics';
import { UPGRADE_PLAN_REQUEST_EVENT } from 'diesel/models/organization';

let application;

// FIXME this is hardcoded to match the value for signIn in
// aptible-helpers
const organizationId = 'o1';

const planUrl = `/organizations/${organizationId}/billing/plan`;
const url = planUrl;
const apiOrganizationUrl = `/billing_details/${organizationId}`;
const activePanelClass = 'active';
const contactAptibleButtonName = 'Contact Aptible';

module('Acceptance: Organizations: Billing: Plan', {
  beforeEach: function() {
    application = startApp();
    stubStacks();
    stubOrganizations();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test(`visiting ${url} requires authentication`, () => {
  stubOrganization();
  expectRequiresAuthentication(url);
});

function expectDisplayedPlanType(assert, planType){
  let $planType = findPlanPanel(assert, planType);
  assert.ok($planType.length, `Finds plan type "${planType}"`);
}

function findPlanPanel(assert, planType){
  return find(`.panel .panel-heading:contains(${planType})`).parent('.panel');
}

test(`shows 3 plan types: development, platform and managed`, (assert) => {
  stubOrganization();
  stubBillingDetail();
  signInAndVisit(url);

  andThen(() => {
    expectDisplayedPlanType(assert, 'Development');
    expectDisplayedPlanType(assert, 'Platform');
    expectDisplayedPlanType(assert, 'Managed');
    expectButton(contactAptibleButtonName);
  });
});

test(`on plan "development": highlights the current plan, shows upgrade button`, (assert) => {
  let plan = 'development';
  stubOrganization();
  stubBillingDetail({plan});
  signInAndVisit(url);

  andThen(() => {
    let panel = findPlanPanel(assert, 'Development');
    assert.ok(panel.hasClass(activePanelClass),
              'panel "Development" is active');

    expectButton('Current Plan', {context:panel});

    let otherPanel = findPlanPanel(assert, 'Platform');
    assert.ok(!otherPanel.hasClass(activePanelClass),
              'platform panel is not active');

    expectButton('Upgrade to Platform', {context:otherPanel});
  });
});

test(`on plan "platform": highlights the current plan, shows "contact support to downgrade" button`, (assert) => {
  let plan = 'platform';
  stubOrganization();
  stubBillingDetail({plan});
  signInAndVisit(url);

  andThen(() => {
    let panel = findPlanPanel(assert, 'Platform');
    assert.ok(panel.hasClass(activePanelClass),
              'panel "Platform" is active');

    expectButton('Current Plan', {context:panel});

    let otherPanel = findPlanPanel(assert, 'Development');
    assert.ok(!otherPanel.hasClass(activePanelClass),
              'Development panel is not active');

    expectButton('Contact Support to downgrade', {context:otherPanel});
  });
});

test(`on plan "production": highlights the current plan, shows "contact support to downgrade" button for both platform and development`, (assert) => {
  let plan = 'production';
  stubOrganization();
  stubBillingDetail({plan});
  signInAndVisit(url);

  andThen(() => {
    let panel = findPlanPanel(assert, 'Managed');
    assert.ok(panel.hasClass(activePanelClass),
              'panel "Managed" is active');

    expectButton('Current Plan', {context:panel});

    let devPanel = findPlanPanel(assert, 'Development');
    let platformPanel = findPlanPanel(assert, 'Platform');

    assert.ok(!devPanel.hasClass(activePanelClass),
              'Development panel is not active');
    assert.ok(!devPanel.hasClass(activePanelClass),
              'Platform panel is not active');

    expectButton('Contact Support to downgrade', {context:platformPanel});
  });
});

test(`on plan "development": clicking the upgrade platform shows modal`, () => {
  let plan = 'development';
  stubBillingDetail({plan});
  stubOrganization();

  signInAndVisit(url);

  clickButton('Upgrade to Platform');

  andThen(() => {
    expectButton('Confirm Upgrade');
  });
});

test(`on plan "development": clicking the upgrade platform updates organization's plan`, (assert) => {
  assert.expect(5);

  let plan = 'development';
  stubOrganization();
  stubBillingDetail({plan});

  stubRequest('put', apiOrganizationUrl, (request) => {
    assert.ok(true, 'updates organization');
    assert.equal(request.json().plan, 'platform');

    Ember.run.next(() => {
      let panel = findPlanPanel(assert, 'Platform');
      expectButton('Upgrading...', {context:panel});
    });

    request.noContent();
  });

  signInAndVisit(url);

  andThen(() => {
    let panel = findPlanPanel(assert, 'Platform');
    assert.ok(!panel.hasClass(activePanelClass),
              'precond - panel is not active before upgrading');
  });

  clickButton('Upgrade to Platform');
  clickButton('Confirm Upgrade'); // <-- modal

  andThen(() => {
    let panel = findPlanPanel(assert, 'Platform');
    assert.ok(panel.hasClass(activePanelClass),
              'panel is active after upgrading');
  });
});

test(`clicking "${contactAptibleButtonName}" triggers a tracking event, shows modal`, (assert) => {
  let organizationName = 'the organization';
  stubOrganization({name: organizationName});
  stubBillingDetail();
  signInAndVisit(url);
  clickButton(contactAptibleButtonName);

  andThen(() => {
    assert.ok(didTrackEventWith(UPGRADE_PLAN_REQUEST_EVENT, 'organization_id', organizationId),
              `tracked event "${UPGRADE_PLAN_REQUEST_EVENT}" with {organization_id: ${organizationId}}`);

    assert.ok(didTrackEventWith(UPGRADE_PLAN_REQUEST_EVENT, 'organization_name', organizationName),
              `tracked event "${UPGRADE_PLAN_REQUEST_EVENT}" with {organization_name: ${organizationName}}`);

    let modal = find('.upgrade-request-modal-panel');
    assert.ok(!!modal.length, 'upgrade request modal is displayed');
  });
});

test('shows error message if the server has error', (assert) => {
  let errorMessage = `Stripe error: This plan cannot be upgraded`;
  let plan = 'development';
  stubOrganization();
  stubBillingDetail({plan});

  stubRequest('put', apiOrganizationUrl, (request) => {
    assert.ok(true, 'updates organization');

    request.error(401, {
      code: 401,
      error: 'invalid_plan_upgrade',
      message: errorMessage
    });
  });

  signInAndVisit(url);
  clickButton('Upgrade to Platform');
  clickButton('Confirm Upgrade'); // <-- modal
  andThen(() => {
    let error = findWithAssert('.alert');
    assert.ok(error.text().indexOf(errorMessage) > -1, 'error message shown');

    let panel = findPlanPanel(assert, 'Platform');
    assert.ok(!panel.hasClass(activePanelClass),
              'platform panel is not shown as active after failed upgrade');
  });
});
