import Ember from 'ember';

export default Ember.Route.extend({
  title() {
    var stack = this.modelFor('stack');
    return `Create a Certificate - ${stack.get('handle')}`;
  },

  model() {
    var stack = this.modelFor('stack');
    return this.store.createRecord('certificate', {
      stack: stack
    });
  },

  renderTemplate(controller) {
    if (!this.session.get('currentUser.verified')) {
      controller.set('resourceType', 'app');
      this.render('unverified');
    } else {
      this._super.apply(this, arguments);
    }
  },

  actions: {
    willTransition() {
      this.currentModel.rollback();
    },

    create() {
      var certificate = this.currentModel;

      certificate.save({ stack: {id: certificate.get('stack.id')} }).then(() => {
        let message = `${certificate.get('commonName')} created.`;
        this.transitionTo('certificates.index');

        Ember.get(this, 'flashMessages').success(message);
      });
    },

    cancel() {
      this.transitionTo('certificates.index');
    }
  }
});
