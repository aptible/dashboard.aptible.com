import Ember from 'ember';
import fetchAllPages from '../utils/fetch-all-pages';

export default Ember.Route.extend({
  title() {
    var stack = this.modelFor('stack');
    return `${stack.get('handle')} Apps`;
  },

  model() {
    var stack = this.modelFor('stack');
    return fetchAllPages(this.store, stack, 'app');
  },

  setupController(controller, model) {
    let stack = this.modelFor('stack');
    controller.setProperties({ model, stack });
  },

  actions: {
    openCreateAppModal() {
      let stack = this.modelFor('stack');
      this.controller.set('newApp', this.store.createRecord('app', { stack }));
    },

    onCreateApp(app) {
      let stack = this.modelFor('stack');

      app.save({ stack: { id: stack.get('id') } }).then(() => {
        this.transitionTo('app', app);
        let message = `${app.get('handle')} app created`;
        Ember.get(this, 'flashMessages').success(message);
      });
    }
  }
});
