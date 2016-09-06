import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from "ember";

moduleForComponent('with-active-class', 'WithActiveClassComponent');

test('it renders active when within', function(assert) {
  this.subject({
    route: 'apps',
    applicationController: Ember.Object.create({currentPath: 'apps.index'})
  });
  var element = this.$();
  assert.equal(element.attr('class'), 'ember-view active');
});

test('it does not render active with not within', function(assert) {
  this.subject({
    route: 'databases',
    applicationController: Ember.Object.create({currentPath: 'apps.index'})
  });
  var element = this.$();
  assert.equal(element.attr('class'), 'ember-view');
});
