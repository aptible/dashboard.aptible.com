import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',

  store: Ember.inject.service(),

  vhost: null,

  isDeleting: false,

  actions: {
    delete() {
      let vhost = this.get('vhost');
      let message = `Confirm Delete\n\nAre you sure you want to delete ${vhost.get('commonName')}?`;

      if (!confirm(message)) {
        return;
      }

      let op = this.get('store').createRecord('operation', {
        type: 'deprovision',
        vhost: vhost
      });

      this.sendAction('startDeletion');
      this.set('isDeleting', true);

      op.save().then( () => {
        vhost.deleteRecord();
        this.sendAction('completeDeletion');
      }).catch( (e) => {
        this.sendAction('failDeletion', e);
      }).finally( () => {
        this.set('isDeleting', false);
      });
    }
  }
});
