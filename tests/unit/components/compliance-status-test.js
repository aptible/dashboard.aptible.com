import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('compliance-status', {
});

let subject = Ember.Object.create({ data: { links: { self: '/users/1' }} });

test('it renders', function(assert) {
  let doc = Ember.Object.create({ userUrl: '/users/2',
                                  createdAt: '2015-05-27T17:47:13.287Z',
                                  nextAssessment: '2016-05-27T17:47:13.287Z' });
  let criterion = Ember.Object.create({ documents: [doc], scope: 'user' });

  assert.expect(2);

  var component = this.subject({ subject: subject, criterion: criterion });
  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});


test('it sets status to green when documents exist', function() {
  let doc = Ember.Object.create({ userUrl: '/users/1',
                                  createdAt: '2015-05-27T17:47:13.287Z',
                                  nextAssessment: '2016-05-27T17:47:13.287Z' });
  let criterion = Ember.Object.create({ documents: [doc], scope: 'user' });

  let component = this.subject({subject: subject, criterion: criterion });
  this.render();

  ok(component.get('status.green'), 'status is green');
});

test('it sets status to red when documents do not exist', function() {
  let doc = Ember.Object.create({ userUrl: '/users/2',
                                  createdAt: '2015-05-27T17:47:13.287Z',
                                  nextAssessment: '2016-05-27T17:47:13.287Z' });
  let criterion = Ember.Object.create({ documents: [doc], scope: 'user' });

  let component = this.subject({subject: subject, criterion: criterion });
  this.render();

  ok(!component.get('status.green'), 'status not green');
});