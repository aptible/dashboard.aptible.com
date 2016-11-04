import Ember from 'ember';

let terabyteInGbs = Math.pow(2,10);

export function formatDiskSize([input]) {
  if (!input) { return '0GB'; }

  if (input > terabyteInGbs) {
    input = input / terabyteInGbs;
    return input.toFixed(2) + 'TB';
  } else {
    return input + 'GB';
  }
}

export default Ember.Helper.helper(formatDiskSize);
