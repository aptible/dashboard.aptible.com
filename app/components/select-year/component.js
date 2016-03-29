import Ember from 'ember';

function range(start, end) {
  return new Array(end-start).join(0).split(0).map((val, id) => id + start);
}
export default Ember.Component.extend({
  years: range(new Date().getFullYear(), new Date().getFullYear() + 6)
});
