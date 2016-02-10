import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['document-activity-item'],
  type: Ember.computed('document.criterion.handle', function() {
    let handles = { training_log: 'Basic',
                    developer_training_log: 'Developer',
                    security_officer_training_log: 'Security'}

    return handles[this.get('document.criterion.handle')];
  })
});
