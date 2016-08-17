import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('list-databases', {
  unit: true
});

test('when last database has been removed, redirect action is called', function(assert) {
  assert.expect(1);

  let dbs = Ember.A([ {foo: '1'}]);

  var targetObject = {
    externalAction: function() {
      assert.ok(true, 'external Action was called!');
    }
  };

  let component = this.subject({ model: dbs });

  component.set('redirect', 'externalAction');
  component.set('targetObject', targetObject);

  Ember.run(function(){
    dbs.removeAt(0);
  });
});

test('when database has been removed, redirect action is not called if other databases present', function(assert) {
  assert.expect(0);

  let dbs = Ember.A([ {foo: '1'}, {foo: '2'} ]);

  var targetObject = {
    externalAction: function() {
      assert.fail('external Action should not be called!');
    }
  };

  let component = this.subject({ model: dbs });

  component.set('redirect', 'externalAction');
  component.set('targetObject', targetObject);

  Ember.run(function(){
    dbs.removeAt(0);
  });
});
