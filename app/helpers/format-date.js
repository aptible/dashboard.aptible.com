import Ember from 'ember';

var months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export function formatDate(date) {
  if (!date) { return; }

  Ember.assert('format-date must be called with an instanceof Date',
               date instanceof Date);

  let monthName = months[ date.getMonth() ];
  return `${monthName} ${date.getDate()}, ${date.getFullYear()}`;
}

export default Ember.Handlebars.makeBoundHelper(formatDate);
