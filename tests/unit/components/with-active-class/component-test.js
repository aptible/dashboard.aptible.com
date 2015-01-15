import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from "ember";

moduleForComponent('with-active-class', 'WithActiveClassComponent');

test('it renders active when within', function() {
  var component = this.subject({
    route: 'apps',
    applicationController: Ember.Object.create({currentPath: 'apps.new'})
  });
  var element = this.append();
  equal(element.attr('class'), 'ember-view active');
});

test('it does not render active with not within', function() {
  var component = this.subject({
    route: 'databases',
    applicationController: Ember.Object.create({currentPath: 'apps.new'})
  });
  var element = this.append();
  equal(element.attr('class'), 'ember-view');
});
