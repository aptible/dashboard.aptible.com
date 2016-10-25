import Ember from 'ember';

export default function filterComponents(components, filters = {}) {
  let searchTerms = Ember.$.trim(filters.search);

  if(typeof filters.adversarial === 'boolean') {
    components = components.filterBy('adversarial', filters.adversarial);
  }

  if(filters.pervasiveness || filters.pervasiveness === 0) {
    components = components.filterBy('scaledPervasiveness', filters.pervasiveness);
  }

  if(filters.relevance || filters.relevance === 0) {
    components = components.filterBy('relevance', filters.relevance);
  }

  if(filters.riskLevel || filters.riskLevel === 0) {
    components = components.filterBy('riskLevel', filters.riskLevel);
  }

  if(filters.impact || filters.impact === 0) {
    components = components.filterBy('impact', filters.impact);
  }

  if(filters.status && typeof filters.status === 'string') {
    components = components.filterBy('status', filters.status);
  }

  if(filters.severity || filters.severity === 0) {
    components = components.filterBy('severity', filters.severity);
  }

  if(searchTerms) {
    searchTerms = new RegExp(searchTerms.toLowerCase().replace(/\W/g, ''));

    components = components.filter((pc) => {
      let { title, description } = pc.getProperties('title', 'description');
      let keywords = (title + description).toLowerCase().replace(/\W/g, '');

      return searchTerms.test(keywords);
    });
  }

  if(filters.sort) {
    components = components.slice(0).sort((a, b) => {
      a = a.get(filters.sort);
      b = b.get(filters.sort);

      if(filters.sort === 'title') {
        if (a === b) { return 0; }
        if (a < b) { return -1; }
        return 1;
      } else {
        // everything else is an number
        a = a || 0;
        b = b || 0;

        return Math.round(parseFloat(b, 10)) - Math.round(parseFloat(a, 10));
      }
    });
  }

  return components;
}