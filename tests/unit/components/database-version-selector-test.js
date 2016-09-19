import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('database-version-selector', {
  needs: ['component:ultimate-select']
});

test('it renders', function(assert) {
  assert.expect(2);

  let databaseImages = [
    Ember.Object.create({ id: 1, visible: true, type: 'postgres' }),
    Ember.Object.create({ id: 2, visible: true, type: 'postgres' }),
    Ember.Object.create({ id: 3, visible: true, type: 'redis' }),
  ];
  let component = this.subject({ databaseImages: databaseImages });

  assert.equal(component._state, 'preRender');

  this.render();
  assert.equal(component._state, 'inDOM');
});


test('only shows database images that are equal to the given type', function(assert) {
  let databaseImages = [
    Ember.Object.create({ id: 1, visible: true, type: 'postgres' }),
    Ember.Object.create({ id: 2, visible: true, type: 'postgres' }),
    Ember.Object.create({ id: 3, visible: true, type: 'redis' })
  ];

  let component = this.subject({ type: 'postgres', databaseImages: databaseImages });
  let visibleDatabaseImages = component.get('visibleDatabaseImages');

  assert.equal(visibleDatabaseImages.get(0), databaseImages[0]);
  assert.equal(visibleDatabaseImages.get(1), databaseImages[1]);
});


test('only shows database images that are visible', function(assert) {
  let databaseImages = [
    Ember.Object.create({ id: 1, visible: true, type: 'postgres' }),
    Ember.Object.create({ id: 2, visible: false, type: 'postgres' }),
  ];

  let component = this.subject({ type: 'postgres', databaseImages: databaseImages });
  let visibleDatabaseImages = component.get('visibleDatabaseImages');

  assert.equal(visibleDatabaseImages.length, 1);
  assert.equal(visibleDatabaseImages.get(0), databaseImages[0]);
});


test('selects the database image of the given type that is default', function(assert) {
  let databaseImages = [
    Ember.Object.create({ id: 1, type: 'postgres', visible: true, default: true }),
    Ember.Object.create({ id: 2, type: 'postgres', visible: true, default: false }),
    Ember.Object.create({ id: 3, type: 'redis', visible: true, default: true }),
  ];
  let component = this.subject({ type: 'postgres', databaseImages: databaseImages });
  assert.equal(component.get('selectedDatabaseImage'), databaseImages[0]);
});
