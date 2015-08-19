import Ember from 'ember';

export default Ember.Component.extend({
  setDefaultState: function() {
    this.set('vhost.certificateBody', null);
    this.set('vhost.privateKey', null);

    if(this.get('certificates.length') > 0) {
      this.set('vhost.certificate', this.get('certificates.firstObject'));
    } else {
      this.set('addNewCertificate', true);
    }
  }.on('init'),

  actions: {
    showAddNewCertificate(show) {
      this.set('addNewCertificate', show);

      if(!show) {
        this.set('vhost.certificateBody', null);
        this.set('vhost.privateKey', null);
      }
    }
  }
});
