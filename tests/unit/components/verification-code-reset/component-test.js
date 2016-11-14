import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('verification-code-reset', {
  unit: true,

  needs: [
    'component:bs-alert',
    'component:bs-alert-dismiss'
  ]
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('it alerts if the user is not verified', function(assert) {
  this.subject({ user: { verified: false, name: 'Some User' }});
  assert.ok(this.$().find('div.alert:contains(Hey Some User)').length,
            'Alert is shown');
});

test('it does not alert if the user is null', function(assert) {
  this.subject();
  assert.ok(!this.$().find('div.alert:contains(Hey Some User)').length,
            'Alert is not shown');
});
