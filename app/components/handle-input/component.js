import OneWayInput from '../one-way-input/component';
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

export default OneWayInput.extend(Autofocusable, {
  sanitizeInput: function(input) {
    if (typeof input !== 'string') { return input; }

    return truncate(input, maxChars).
      replace(capitalLetters, replaceWithLower).
      replace(spaces, '-').
      // FIXME: nonAlphaNumerics really should be replaced with an empty string,
      // however that breaks the `value` attr binding so that the first invalid
      // character is never actually stripped.
      replace(nonAlphaNumerics, '-');
  }
});
