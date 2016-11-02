import {
  moduleForModel,
  test
} from 'ember-qunit';
import { stubRequest } from 'ember-cli-fake-server';
import modelDeps from '../../support/common-model-dependencies';
import Ember from 'ember';

moduleForModel('app', 'model:certificate', {
  needs: modelDeps.concat([
    'adapter:certificate'
  ])
});

test('finding uses correct url', function(assert){
  let done = assert.async();
  assert.expect(2);

  let certificateId = 'my-cert-id';

  stubRequest('get', `/certificates/${certificateId}`, function(){
    assert.ok(true, 'calls with correct URL');

    return this.success({
      id: certificateId,
      body: 'cert',
      privateKey: 'private key',
      _links: {
        account: { href: '/accounts/1' }
      }
    });
  });

  let store = this.store();

  return Ember.run(function(){
    return store.find('certificate', certificateId).then(function(){
      assert.ok(true, 'certificate did find');
    }).finally(done);
  });
});

test('reloading certificate with stack uses correct url', function(assert){
  assert.expect(1);
  let done = assert.async();
  let store = this.store();

  let certificate = Ember.run(store, 'push', 'certificate', {id:'c1'});
  let stack = Ember.run(store, 'push', 'stack', {id:'stack1'});

  stubRequest('get', `/certificates/c1`, function(){
    assert.ok(true, 'gets correct url');
    return this.success({id:'c1'});
  });

  Ember.run(() => {
    certificate.set('stack', stack);
    certificate.reload().finally(done);
  });
});

test('creating POSTs to correct url', function(assert) {
  assert.expect(2);

  let store = this.store();
  let certificate, stack;
  let done = assert.async();

  Ember.run(function(){
    stack = store.createRecord('stack', {id: '1'});
    certificate = store.createRecord('certificate', {body:'cert', stack:stack});
  });

  stubRequest('post', '/accounts/1/certificates', function(){
    assert.ok(true, 'calls with correct URL');

    return this.success(201, {
      id: 'my-certificate-id',
      body: 'cert'
    });
  });

  return Ember.run(function(){
    return certificate.save().then(function(){
      assert.ok(true, 'certificate did save');
    }).finally(done);
  });
});

test("shortDisplayFingerprint truncates the fingerprint", function(assert) {
  assert.expect(1);

  let store = this.store();
  let certificate = Ember.run(store, "push", "certificate", {
    id: 1, sha256Fingerprint: "01d259fa5742122d74ac7b6e48be32ef17ce2cc23abfb62bf02144959e52307f"
  });

  assert.equal(certificate.get("shortDisplayFingerprint"), "01d259f");
});

test("shortDisplayFingerprint does not crash if the fingerprint is missing", function(assert) {
  assert.expect(1);

  let store = this.store();
  let certificate = Ember.run(store, "push", "certificate", { id: 1 });

  assert.equal(certificate.get("shortDisplayFingerprint"), certificate.get("sha256Fingerprint"));
});

test("issuerDisplayName defaults to the issuer organization", function(assert) {
  assert.expect(1);

  let store = this.store();
  let certificate = Ember.run(store, "push", "certificate", {
    id: 1, issuerOrganization: "Foo Org", issuerCommonName: "Foo"
  });

  assert.equal(certificate.get("issuerDisplayName"), "Foo Org");
});

test("issuerDisplayName falls back to the issuer common name", function(assert) {
  assert.expect(1);

  let store = this.store();
  let certificate = Ember.run(store, "push", "certificate", {
    id: 1, issuerCommonName: "Foo"
  });

  assert.equal(certificate.get("issuerDisplayName"), "Foo");
});

test("name shows the Common Name", function(assert) {
  assert.expect(1);

  let store = this.store();
  let certificate = Ember.run(store, "push", "certificate", {
    id: 1, commonName: "foo.com"
  });

  assert.equal(certificate.get("name"), "foo.com");
});

test("name shows notBefore and notAfter", function(assert) {
  assert.expect(1);

  let store = this.store();
  let certificate = Ember.run(store, "push", "certificate", {
    id: 1, commonName: "foo.com",
    notBefore: new Date(Date.UTC(2016, 0, 1)),
    notAfter: new Date(Date.UTC(2017, 1, 2))
  });

  assert.equal(certificate.get("name"), "foo.com - Valid: January 1, 2016 - February 2, 2017");
});

test("name shows issuerDisplayName", function(assert) {
  assert.expect(1);

  let store = this.store();
  let certificate = Ember.run(store, "push", "certificate", {
    id: 1, commonName: "foo.com",
    notBefore: new Date(Date.UTC(2016, 0, 1)),
    notAfter: new Date(Date.UTC(2017, 1, 2)),
    issuerOrganization: "Foo Org"
  });

  assert.equal(certificate.get("name"),
    "foo.com - Valid: January 1, 2016 - February 2, 2017 - Foo Org");
});

test("name shows sha256Fingerprint", function(assert) {
  assert.expect(1);

  let store = this.store();
  let certificate = Ember.run(store, "push", "certificate", {
    id: 1, commonName: "foo.com",
    notBefore: new Date(Date.UTC(2016, 0, 1)),
    notAfter: new Date(Date.UTC(2017, 1, 2)),
    issuerOrganization: "Foo Org",
    sha256Fingerprint: "1234567890"
  });

  assert.equal(certificate.get("name"),
    "foo.com - Valid: January 1, 2016 - February 2, 2017 - Foo Org - 1234567");
});
