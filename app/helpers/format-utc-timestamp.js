import Ember from 'ember';
import { monthNames } from 'diesel/utils/dates';

function padLeft(str, len=2, filler="0"){
  str = '' + str; // coerce
  while (str.length < len) {
    str = filler + str;
  }

  return str;
}

export function formatUtcTimestamp(date) {
  if (!date) { return; }

  Ember.assert('format-utc-timestamp must be given an instanceof Date',
               date instanceof Date);

  let month = monthNames[ date.getMonth() ];
  let day   = date.getUTCDate();
  let year  = date.getUTCFullYear();
  let hours = date.getUTCHours();
  let period = hours >= 12 ? 'PM' : 'AM';
  hours = hours > 12 ? (hours-12) : hours;
  let minutes = padLeft(date.getUTCMinutes(), 2, '0');

  return `${month} ${day}, ${year} ${hours}:${minutes}${period} UTC`;
}

export default Ember.Handlebars.makeBoundHelper(formatUtcTimestamp);
