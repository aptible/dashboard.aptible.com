import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

let organizationStub = { getCriterionSubjects: function() { return []; } };

moduleForComponent('training-criterion-status', {
  needs:['component:user-training-criterion-status']
});

test('it renders', function(assert) {
  assert.expect(2);

  var component = this.subject({ organization:  organizationStub });
  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});

