import Ember from 'ember';
import fetchAllPages from '../utils/fetch-all-pages';
const DEFAULT_DISK_SIZE = 10;
export default Ember.Route.extend({
  title(){
    let stack = this.modelFor('stack');
    return `${stack.get('handle')} Databases`;
  },

  model(){
    let stack = this.modelFor('stack');
    return fetchAllPages(this.store, stack, 'database');
  },

  setupController(controller, model){
    let stack = this.modelFor('stack');
    let databaseImages = this.store.find('database-image');
    controller.setProperties({ model, stack, databaseImages});
  },

  actions: {
    openCreateDbModal() {
      let stack = this.modelFor('stack');
      this.controller.set('newDb', this.store.createRecord('database', { stack }));
      this.controller.set('diskSize', DEFAULT_DISK_SIZE);
    },

    onCreateDb(database) {
      let stack = this.modelFor('stack');
      let diskSize = this.controller.get('diskSize');
      let handle = database.get('handle');

      database.save({ stack: { id: stack.get('id') }}).then(() => {
        let operation = this.store.createRecord('operation', {
          type: 'provision', diskSize, database
        });

        return operation.save();
      }).then(() => {
        let message = `${handle} database created`;

        this.transitionTo('databases.index');
        Ember.get(this, 'flashMessages').success(message);
      }, (e) => {
        let defaultMessage = `There was an error saving ${handle}`;
        let message = Ember.getWithDefault(e, 'responseJSON.message', defaultMessage);
        Ember.get(this, 'flashMessages').danger(message);
      });
    }
  }
});