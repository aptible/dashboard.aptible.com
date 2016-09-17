import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['panel', 'panel-default', 'compliance-engine-status', 'resource-list-item'],
  criterion: null,
  documents: null,
  title: Ember.computed.reads('status.criterion.name'),
  showDownload: Ember.computed.match('status.criterion.handle', /risk|policy/),
  latestDocumentDownload: Ember.computed('showDownload', 'status.recentActivityDocuments.[]', function() {
    if(this.get('showDownload')) {
      return this.get('status.recentActivityDocuments.firstObject.printVersionUrl');
    }
  })
});
