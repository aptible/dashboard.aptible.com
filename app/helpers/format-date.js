import Ember from 'ember';
import { monthNames } from '../utils/dates';

export function formatDate([date]) {
  if (!date) { return; }

  Ember.assert('format-date must be called with an instanceof Date',
               date instanceof Date);

  let monthName = monthNames[ date.getMonth() ];
  return `${monthName} ${date.getDate()}, ${date.getFullYear()}`;
}

export default Ember.Helper.helper(formatDate);
