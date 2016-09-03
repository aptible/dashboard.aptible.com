import Ember from 'ember';
import { module, test, skip } from 'qunit';
import {
  ProvisionableBaseMixin,
  STATUSES,
  SHOULD_RELOAD,
  SET_SHOULD_RELOAD
} from '../../../mixins/models/provisionable';

// minimum setTimeout resolution is 10 ms
const TEST_RELOAD_RETRY_DELAY = 10;

const FakeModel = Ember.Object.extend(ProvisionableBaseMixin, {
  _reloadRetryDelay: TEST_RELOAD_RETRY_DELAY,
  reloadWhileProvisioning: true,
  reload() {
    return Ember.RSVP.resolve();
  }
});

module('mixin:provisionable', {
  beforeEach() {
    this.originalShouldReload = SHOULD_RELOAD;
  },

  afterEach() {
    SET_SHOULD_RELOAD(this.originalShouldReload);
  }
});


test('will not reload when status is not STATUSES.PROVISIONING', function(assert) {
  assert.expect(1);

  let model = FakeModel.create({
    status: STATUSES.PROVISIONED
  });

  assert.equal(model._shouldReload(), false);
});

test('will not reload when reloadWhileProvisioning is false', function(assert) {
  assert.expect(1);

  let model = FakeModel.create({
    status: STATUSES.PROVISIONING,

    reloadWhileProvisioning: false
  });

  assert.equal(model._shouldReload(), false);
});

test('will not reload when SHOULD_RELOAD is false', function(assert) {
  assert.expect(1);

  SET_SHOULD_RELOAD(false);

  let model = FakeModel.create({
    status: STATUSES.PROVISIONING
  });

  assert.equal(model._shouldReload(), false);
});

test('will reload when STATUS.PROVISIONING', function(assert) {
  assert.expect(1);

  let model = FakeModel.create({
    status: STATUSES.PROVISIONING
  });

  assert.equal(model._shouldReload(), true);
});

skip('recursively calls reload while STATUSES.PROVISIONING', function(assert) {
  // TODO:
  // This test is really flakey on phantom JS 2.1.  Need to debug and fix
  assert.expect(2);
  let done = assert.async();

  let model = FakeModel.create({
    status: STATUSES.PROVISIONING,
    count: 0,

    reload() {
      if (this.count > 5) {
        this.set('status', STATUSES.PROVISIONED);
        assert.ok(true, 'called reload correct number of times');
      }

      this.count++;

      return Ember.RSVP.resolve();
    }
  });

  Ember.run.later(function() {
    assert.ok(!model.get('isProvisioning'), 'model is no longer provisioning');

    done();
  }, TEST_RELOAD_RETRY_DELAY*10);
});
