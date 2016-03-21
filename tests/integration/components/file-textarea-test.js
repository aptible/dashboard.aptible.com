import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('file-textarea', { integration: true });

test('renders a textarea', function(assert) {
  this.render(
    hbs('{{file-textarea value="" name="body" rows=10 autofocus=true}}')
  );
  assert.equal(this.$('textarea').length, 1);
});

test('sets a class when drag events are triggered', function(assert) {
  this.render(
    hbs('{{file-textarea value="" name="body" rows=10 autofocus=true}}')
  );
  let $elem = this.$('textarea').parent();

  $elem.trigger('dragenter');
  assert.ok($elem.is('.drop-target-active'));
  $elem.trigger('drageleave');
  assert.ok($elem.not('.drop-target-active'));
});

test('unsets drop target class on drop', function(assert) {
  let dropEvent = {
    type: 'drop',
    stopPropagation: function() {},
    preventDefault: function(){},
    dataTransfer: {
      files: [{
        lastModified: 1457470091000,
        name: 'test.txt',
        size: 1675,
        type: ''
      }]
    }
  };
  this.render(hbs('{{file-textarea value="" name="body" rows=10 autofocus=true}}'));
  let $elem = this.$('textarea').parent();

  $elem.trigger('dragenter');
  assert.ok($elem.is('.drop-target-active'));
  $elem.trigger(dropEvent);
  assert.ok($elem.not('.drop-target-active'));
});

test('appends file contents to the textarea', function(assert) {
  let txt1 = 'I love deadlines. I like the whooshing sound they make as they\n';
  let txt2 = 'fly by. -- Douglas Adams';
  let dropEvent = {
    type: 'drop',
    stopPropagation: function() {},
    preventDefault: function(){},
    dataTransfer: {
      files: [{
        name: 'test1.txt',
        result: txt1
      }, {
        name: 'test2.txt',
        result: txt2
      }]
    }
  };

  // Overwrite the FileReader class for testing
  window.FileReader = class {
    constructor() { }
    readAsText(file) {
      if (file.hasOwnProperty('result')) {
        this.onload({ type: 'load', target: file });
      }
    }
  };

  this.render(hbs('{{file-textarea value="" name="body" rows=10}}'));
  let $elem = this.$('textarea').parent();
  let $textarea = this.$('textarea');

  $elem.trigger(dropEvent);
  assert.equal($textarea.val(), txt1 + txt2);
});
