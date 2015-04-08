import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('user-gravatars', {
  needs: ['component:gravatar-image', 'component:bs-tooltip']
});

test('it renders', function() {
  expect(2);

  var component = this.subject({
    users: [Ember.Object.create({ email: 'test@example.com'} )],
    size: 24,
    count: 1,
    placeholder: '--'
  });

  equal(component._state, 'preRender');

  this.render();
  equal(component._state, 'inDOM');
});

test('it truncates users when passed a count', function() {
  let users = [
    Ember.Object.create({ email: 'test@example.com'} ),
    Ember.Object.create({ email: 'test1@example.com'} ),
    Ember.Object.create({ email: 'test2@example.com'} ),
    Ember.Object.create({ email: 'test3@example.com'} ),
  ];

  let component = this.subject({
    users: users,
    size: 24,
    count: 2,
    placeholder: '--'
  });

  this.render();

  equal(component.get('truncatedUsers.length'), 2, 'count of 2 truncates to 2 users');
});