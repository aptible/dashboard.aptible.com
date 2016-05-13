import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('user-gravatars', {
  needs: ['component:gravatar-image', 'component:bs-tooltip']
});

test('it renders', function(assert) {
  assert.expect(2);

  var component = this.subject({
    users: Ember.A([Ember.Object.create({ email: 'test@example.com'})]),
    size: 24,
    count: 1,
    placeholder: '--'
  });

  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});

test('it truncates users when passed a count', function(assert) {
  let users = Ember.A([
    Ember.Object.create({ email: 'test@example.com'}),
    Ember.Object.create({ email: 'test1@example.com'}),
    Ember.Object.create({ email: 'test2@example.com'}),
    Ember.Object.create({ email: 'test3@example.com'}),
  ]);

  let component = this.subject({
    users: users,
    size: 24,
    count: 2,
    placeholder: '--'
  });

  this.render();

  assert.equal(component.get('truncatedUsers.length'), 2, 'count of 2 truncates to 2 users');
});

test('it displays the remainder when the number of users exceeds the count', function(assert) {
  let users = Ember.A([
    Ember.Object.create({ email: 'test@example.com'}),
    Ember.Object.create({ email: 'test1@example.com'}),
    Ember.Object.create({ email: 'test2@example.com'}),
    Ember.Object.create({ email: 'test3@example.com'}),
  ]);

  this.subject({
    users: users,
    size: 24,
    count: 2,
    placeholder: '--'
  });

  this.render();

  assert.equal($('.user-gravatar-remainder:contains("+ 2 more")').length, 1, 'displays there are 2 more users');
});

test('it does not show a remainder when the users are less than or equal to the a count', function(assert) {
  let users = Ember.A([
    Ember.Object.create({ email: 'test@example.com'}),
    Ember.Object.create({ email: 'test1@example.com'})
  ]);

  this.subject({
    users: users,
    size: 24,
    count: 2,
    placeholder: '--'
  });

  this.render();

  assert.equal($('.user-gravatar-remainder').length, 0, 'no remainder of users');
});
