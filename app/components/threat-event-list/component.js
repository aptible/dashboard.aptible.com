import Ember from 'ember';
export default Ember.Component.extend({
  tagName: 'table',
  classNames: ['base-table'],
  filteredThreatEvents: Ember.computed('filters.relevance', 'filters.sort', 'filters.impact', 'filters.search', 'threatEvents.[]', function() {
    let threatEvents = this.get('threatEvents');
    let filters = this.get('filters');
    let searchTerms = Ember.$.trim(filters.search);

    if(filters.relevance || filters.relevance === 0) {
      threatEvents = threatEvents.filterBy('relevance', filters.relevance);
    }

    if(filters.impact || filters.impact === 0) {
      threatEvents = threatEvents.filterBy('impact', filters.impact);
    }

    if(searchTerms) {
      searchTerms = new RegExp(searchTerms.toLowerCase().replace(/\W/g, ''));

      threatEvents = threatEvents.filter((threatEvent) => {
        let { title, description } = threatEvent.getProperties('title', 'description');
        let keywords = (title + description).toLowerCase().replace(/\W/g, '');

        return searchTerms.test(keywords);
      });
    }

    if(filters.sort) {
      threatEvents = threatEvents.slice(0).sort((a, b) => {
        a = a.get(filters.sort);
        b = b.get(filters.sort);
        // string sort for title
        if(filters.sort === 'title') {
          if (a == b) { return 0; }
          if (a < b) { return -1; }
          return 1;
        } else {
          // everything else is an integer
          return parseFloat(b, 10) - parseFloat(a, 10);
        }
      });
    }

    return threatEvents;
  })
});