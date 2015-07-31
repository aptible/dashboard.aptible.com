import Ember from 'ember';
import Autofocusable from '../../mixins/views/autofocusable';

export var maxChars = 64;

function replaceWithLower(match){
  return match.toLowerCase();
}

function truncate(input){
  return input.slice(0, maxChars);
}

let capitalLetters = /[A-Z]/g;
let spaces = /\s+/g;
let nonAlphaNumerics = /[^0-9a-z._-]/g;

function sanitizeInput(input){
  if (typeof input !== 'string') { return input; }

  return truncate(input, maxChars).
         replace(capitalLetters, replaceWithLower).
         replace(spaces, '-').
         replace(nonAlphaNumerics, '');
}

function handleChangeEvent() {
  let value = this.readDOMAttr('value');

  processValue.call(this, value);
}

function processValue(rawValue) {
  let value = sanitizeInput(rawValue);

  if (this._sanitizedValue !== value) {
    this._sanitizedValue = value;
    this.attrs.update(value);
  }
}

export default Ember.Component.extend(Autofocusable, {
  tagName: 'input',
  attributeBindings: [ 'type', 'value', 'placeholder', 'name' ],
  type: 'text',

  input: handleChangeEvent,
  change: handleChangeEvent,

  _sanitizedValue: undefined,

  didReceiveAttrs: function() {
    if (!this.attrs.update) {
      throw new Error('You must provide an `update` action to `{{handle-input}}`.');
    }

    processValue.call(this, this.get('value'));
  }
});
