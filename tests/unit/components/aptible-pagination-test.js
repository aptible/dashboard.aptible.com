import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('aptible-pagination', 'AptiblePaginationComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('next page div is hidden when there is no next page', function() {
  var component = this.subject({
    hasNext: true
  });

  var element = this.$();

  var next = element.find('.pager .next');
  ok(next.length, 'has .next div');

  Ember.run(component, 'set', 'hasNext', false);

  ok(element.find('.pager .next').length === 0, 'next is hidden');
});

test('prev page div is hidden when there is no prev page', function() {
  var component = this.subject({
    hasPrev: false
  });

  var element = this.$();
  var prev = element.find('.pager .previous');

  ok(prev.length === 0, 'previous is hidden');

  Ember.run(component, 'set', 'hasPrev', true);

  ok(element.find('.pager .previous').length, 'has .previous div');
});

test('hasNext is calculated from currentPage, totalCount and perPage', function(){
  var component = this.subject({
    currentPage: 1,
    totalCount: 5,
    perPage: 2
  });

  ok(component.get('hasNext'), 'has next');
  ok(!component.get('hasPrev'), '! has prev');

  Ember.run(component, 'set', 'currentPage', 2);

  ok(component.get('hasNext'), 'has next');
  ok(component.get('hasPrev'), 'has prev');

  Ember.run(component, 'set', 'currentPage', 3);

  ok(!component.get('hasNext'), '! has next');
  ok(component.get('hasPrev'), 'has prev');
});
