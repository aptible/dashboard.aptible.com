import Ember from 'ember';

export default Ember.Component.extend({
 classNames: ['team-index'],
 teamMembers: Ember.computed('teamDocument', function() {
    let teamDocument = this.get('teamDocument');
    return teamDocument.values;
  })
});
