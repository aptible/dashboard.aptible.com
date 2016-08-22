import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';
import modelDeps from '../../support/common-model-dependencies';

moduleForModel('otp-recovery-code', 'model:otp-recovery-code', {
  // Specify the other units that are required for this test.
  needs: modelDeps.concat([
    'adapter:otp-recovery-code'
  ])
});

test('Can be accessed via a otp-configuration', function(assert){
  assert.expect(3);

  let done = assert.async();
  let conf;
  let store = this.store();

  Ember.run(() => {
    conf = store.push('otp-configuration',{
      id: 'otp123',
      links: {
        otpRecoveryCodes: '/otp_configurations/otp123/otp_recovery_codes'
      }
    });
  });

  stubRequest('get', '/otp_configurations/otp123/otp_recovery_codes', function(){
    assert.ok(true, 'gets to correct url');
    return this.success({
      _embedded: {
        otp_recovery_codes: [{ id: "r-123" }, { id: "r-456" }]
      }
    });
  });

  Ember.run(() => {
    conf.get("otpRecoveryCodes").then((recoveryCodes) => {
      recoveryCodes.forEach(() => {
        assert.ok(true, 'finds a recovery code');
      });
    }).finally(done);
  });
});
