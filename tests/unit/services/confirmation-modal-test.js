import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('service:confirmation-modal');

test('it fires events', function(assert) {
  assert.expect(1);
  var service = this.subject();
  service.on('open', (data) => {
    assert.ok(data.isMyData, 'data is passed through');
  });
  service.open({ isMyData: true });
});
