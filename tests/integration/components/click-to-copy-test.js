import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

// Clipboard Mock
let clipboardInstance;
function mockClipboard() {
  clipboardInstance = this;
}
mockClipboard.prototype.on = function(eventType, callback) {
  mockClipboard[eventType] = callback;
};

moduleForComponent('click-to-copy', {
  integration: true
});

test('basic attributes are set', function(assert) {
  this.set('mockClipboard', mockClipboard);
  this.render(
    hbs('{{click-to-copy text="copy this" Clipboard=mockClipboard}}')
  );

  let clickToCopy = this.$('.click-to-copy');

  assert.equal(clickToCopy.attr('data-clipboard-text'), 'copy this');
  assert.equal(clickToCopy.text().trim(), 'Copy');
  assert.ok(clickToCopy.hasClass('click-to-copy'));

  mockClipboard.success();
  assert.equal(clickToCopy.attr('data-message'), 'Copied!');
  assert.ok(clickToCopy.hasClass('tooltipped'));

  mockClipboard.error();
  assert.equal(clickToCopy.attr('data-message'), 'Press ⌘+C to copy');
  assert.ok(clickToCopy.hasClass('tooltipped'));
});

test('can set mutable attributes', function(assert) {
  this.set('mockClipboard', mockClipboard);
  this.render(
    hbs`{{click-to-copy text="copy this" Clipboard=mockClipboard
        actionLabel="Click Me!" successMessage="Yay!" errorMessage="Boo!"}}`
  );

  let clickToCopy = this.$('.click-to-copy');
  assert.equal(clickToCopy.text().trim(), 'Click Me!');

  mockClipboard.success();
  assert.equal(clickToCopy.attr('data-message'), 'Yay!');
  assert.ok(clickToCopy.hasClass('tooltipped'));

  mockClipboard.error();
  assert.equal(clickToCopy.attr('data-message'), 'Boo!');
  assert.ok(clickToCopy.hasClass('tooltipped'));
});
