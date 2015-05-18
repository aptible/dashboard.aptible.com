import Ember from 'ember';

// FIXME this is not bound to the property passed in. It will only
// show the correct values on a complete rerender of a template
export function formatList(params) {
  let [list, property, separator] = params;
  return list.map(i => Ember.get(i, property)).join(separator || ', ');
}

export default Ember.HTMLBars.makeBoundHelper(formatList);
