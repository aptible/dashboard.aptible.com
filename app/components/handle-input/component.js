import Ember from 'ember';

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

export default Ember.TextField.extend({
  _sanitizedValue: null,
  value: Ember.computed(function(key, value){
    if (arguments.length > 1) {
      this._sanitizedValue = sanitizeInput(value);
    }
    return this._sanitizedValue;
  })
});
