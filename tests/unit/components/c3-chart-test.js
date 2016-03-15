import startApp from '../../helpers/start-app';
import Ember from 'ember';

import {
  moduleForComponent,
  test
} from 'ember-qunit';

let App;

moduleForComponent('c3-chart', 'C3ChartComponent', {
  unit: true,
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('it renders', function(assert) {
  let component = this.subject();
  assert.equal(component._state, 'preRender');
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('it does not attempt to render without data', function(assert) {
  assert.equal(this.$().children().length, 0);
});

test('it renders once data, grid, and axis are provided', function(assert) {
  // Note: this.render() is implied by this.$()
  this.subject();
  assert.equal(this.$().children("svg").length, 0);

  Ember.run(() => {
    this.subject().set('data', {columns: []});
    this.subject().set('axis', {});
    this.subject().set('grid', {});
  });
  andThen(() => {
    assert.equal(this.$().children("svg").length, 1);
  });
});

test('it accepts promises for data, axis, and grid', function(assert) {
  let resolveData, resolveAxis, resolveGrid;

  Ember.run(() => {
    this.subject().set('data', new Ember.RSVP.Promise((resolve) => {
      resolveData = resolve;
    }));
    this.subject().set('axis', new Ember.RSVP.Promise((resolve) => {
      resolveAxis = resolve;
    }));
    this.subject().set('grid', new Ember.RSVP.Promise((resolve) => {
      resolveGrid = resolve;
    }));
  });

  assert.equal(this.$().children().length, 0);

  Ember.run(() => {
    resolveData({columns: []});
    resolveAxis({});
    resolveGrid({});
  });

  assert.equal(this.$().children("svg").length, 1);
});

test('it renders data', function(assert) {
  this.subject({
    data: {columns: [['someDataOnChart', 1, 2, 3]]},
    axis: {},
    grid: {}
  });

  assert.equal(this.$().children("svg").length, 1);
  assert.ok(this.$().text().indexOf('someDataOnChart') > -1);
});

test('it accepts data updates after initial rendering', function(assert) {
  this.subject({
    data: {columns: []},
    axis: {},
    grid: {}
  });
  assert.ok(this.$().text().indexOf('someDataOnChart') === -1);

  Ember.run(() => {
    this.subject().set('data', { columns: [["someDataOnChart", 1, 2, 3]] });
  });

  andThen(() => {
    assert.ok(this.$().text().indexOf('someDataOnChart') > -1);
  });
});

test('it renders axis', function(assert) {
  this.subject({
    data: {columns: [["some data", 0]]},
    axis: {y: { label: {text: "someAxisLabel"}}},
    grid: {}
  });

  assert.equal(this.$().children("svg").length, 1);
  assert.ok(this.$().text().indexOf('someAxisLabel') > -1);
});

test('it accepts axis max updates', function(assert) {
  this.subject({
    data: {columns: [["someDataOnChart", 0]]},
    axis: {},
    grid: {}
  });
  assert.ok(this.$().text().indexOf('5000000') === -1);

  Ember.run(() => {
    this.subject().set('axis', { y: { max: 5000000} });
  });

  andThen(() => {
    assert.ok(this.$().text().indexOf('5000000') > -1);
  });
});

test('it renders grid lines', function(assert) {
  this.subject({
    data: {columns: [["someDataOnChart", 0, 100]]},
    axis: {},
    grid: {x: {lines: [{value: 1, text: "someLineOnChart"}]}}
  });

  assert.ok(this.$().text().indexOf('someLineOnChart') > -1);
});

test('it accepts grid line updates', function(assert) {
  this.subject({
    data: {columns: [["someDataOnChart", 0, 100]]},
    axis: {},
    grid: {x: {lines: []}}
  });
  assert.ok(this.$().text().indexOf('someLineOnChart') === -1);

  Ember.run(() => {
    this.subject().set('grid', {x: {lines: [{value: 10, text: "someLineOnChart"}]}});
  });

  andThen(() => {
    assert.ok(this.$().text().indexOf('someLineOnChart') > -1);
  });
});
