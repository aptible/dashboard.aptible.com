import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('compliance-status', {
});

let organizationUrl = '/organizations/o1';
let subject = Ember.Object.create({ data: { links: { self: '/users/1' }} });
let organization = { data: { links: { self: organizationUrl } } };

test('it renders', function(assert) {
  let doc = Ember.Object.create({ userUrl: '/users/2',
                                  createdAt: '2015-05-27T17:47:13.287Z',
                                  nextAssessment: '2016-05-27T17:47:13.287Z' });
  let criterion = Ember.Object.create({ documents: [doc], scope: 'user' });

  assert.expect(2);

  var component = this.subject({ subject: subject, criterion: criterion, organization: organization });
  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});


test('it sets status to green when documents exist', function() {
  let doc = Ember.Object.create({ userUrl: '/users/1',
                                  createdAt: '2015-05-27T17:47:13.287Z',
                                  nextAssessment: '2016-05-27T17:47:13.287Z',
                                  organizationUrl: organizationUrl });
  let criterion = Ember.Object.create({ documents: [doc], scope: 'user', getSubjectStatus: function() { return { green: true };} });

  let component = this.subject({subject: subject, criterion: criterion, organization: organization });
  this.render();

  ok(component.get('status.green'), 'status is green');
});

test('it sets status to red when documents do not exist', function() {
  let doc = Ember.Object.create({ userUrl: '/users/2',
                                  createdAt: '2015-05-27T17:47:13.287Z',
                                  nextAssessment: '2016-05-27T17:47:13.287Z',
                                  organizationUrl: organizationUrl });
  let criterion = Ember.Object.create({ documents: [doc], scope: 'user', getSubjectStatus: function() { return { green: false }; } });

  let component = this.subject({subject: subject, criterion: criterion, organization: organization });
  this.render();

  ok(!component.get('status.green'), 'status not green');
});