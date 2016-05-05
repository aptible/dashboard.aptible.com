import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',

  store: Ember.inject.service(),

  vhost: null,
  isProvisioning: Ember.computed.equal('vhost.isProvisioning', true),
  isDeprovisioning: Ember.computed.equal('vhost.isDeprovisioning', true),

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

      op.save()
        .then(() => {
          vhost.set('status', 'deprovisioning');
          this.sendAction('completeDeletion');
        }).catch((e) => {
          vhost.set('status', 'deprovision_failed');
          this.sendAction('failDeletion', e);
        });
    }
  }
});
