import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

let criterionStub = {  };

moduleForComponent('user-training-overall-status', {
  needs:['component:compliance-status', 'component:compliance-icon', 'component:gravatar-image', 'service:compliance-validator']
});

let status = { green: true };
let subject = Ember.Object.create({ data: { links: { self: '/users/1' }} });
let doc = Ember.Object.create({ userUrl: '/users/2',
                                  createdAt: '2015-05-27T17:47:13.287Z',
                                  nextAssessment: '2016-05-27T17:47:13.287Z' });
let criterion = Ember.Object.create({ documents: [doc], scope: 'user',
                                      organizationUrl: 'o1',
                                      getSubjectStatus: function() { return status; },
                                      getOrganizationSubjects: function() { return []; }});
let organization = { data: { links: { self: 'o1' }},
                     getCriterionSubjects: function() { return []; }};

test('it renders', function(assert) {
  assert.expect(2);

  var component = this.subject({ user: subject, criteria: [criterion], organization });
  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});
