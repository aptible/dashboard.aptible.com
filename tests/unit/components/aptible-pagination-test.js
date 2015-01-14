import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('aptible-pagination', 'AptiblePaginationComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('next page div is disabled when there is no next page', function() {
  var component = this.subject({
    hasNext: true
  });

  var element = this.append();

  var next = element.find('.pagination .next');
  ok(next.length, 'has .next div');

  ok(!next.hasClass('disabled'), 'next is not disabled');

  Ember.run(component, 'set', 'hasNext', false);

  ok(next.hasClass('disabled'), 'next is disabled');
});

test('prev page div is disabled when there is no prev page', function() {
  var component = this.subject({
    hasPrev: false
  });

  var element = this.append();

  var prev = element.find('.pagination .prev');
  ok(prev.length, 'has .prev div');

  ok(prev.hasClass('disabled'), 'prev is disabled');

  Ember.run(component, 'set', 'hasPrev', true);

  ok(!prev.hasClass('disabled'), 'prev is not disabled');
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
