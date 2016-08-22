import Ember from 'ember';

export function filterByOrganization(params/*, hash*/) {
  const organizationUrl = Ember.get(params[1], 'data.links.self');
  return params[0].filterBy('data.links.organization', organizationUrl);
}

export default Ember.HTMLBars.makeBoundHelper(filterByOrganization);
