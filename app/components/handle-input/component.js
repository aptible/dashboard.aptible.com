import Ember from 'ember';
import FocusableInput from '../focusable-input/component';

export var maxChars = 64;

function replaceWithLower(match){
  return match.toLowerCase();
}

function truncate(input){
  return input.slice(0, maxChars);
}

let capitalLetters = /[A-Z]/g;
let spaces = /\s+/g;
//let nonAlphaNumerics = /[^0-9a-z._-]/g;

function sanitizeInput(input){
  if (typeof input !== 'string') { return input; }

  return truncate(input, maxChars).
         replace(capitalLetters, replaceWithLower).
         replace(spaces, '-');
          // FIXME: Removing characters causes wonkiness and doesn't really
          // work. Even when marking the computed as .volatile(), the
          // the original, non-sanitized value is persisted when removing a
          // nonAlphaNumerics character.
         //replace(nonAlphaNumerics, '');
}

export default FocusableInput.extend({
  _sanitizedValue: null,
  value: Ember.computed({
    get() {
      return this._sanitizedValue;
    },
    set(key, value) {
      this._sanitizedValue = sanitizeInput(value);
      return this._sanitizedValue;
    }
  })
});
