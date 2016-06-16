import Ember from 'ember';
import Paginated from 'diesel/mixins/routes/paginated';

export default Ember.Route.extend(Paginated, {
  getPaginatedResourceType: () => 'backup',

  composeQuery(page) {
    return {
      database: this.modelFor('database'),
      page: page
    };
  },

  actions: {
    createBackup: function() {
      const database = this.modelFor('database');

      return this.get("store").createRecord('operation', {
        type: 'backup',
        database: database
      }).save()
        .then((operation) => {
          this.get("flashMessages").success("Backup scheduled");
          return operation;
        })
        .then((operation) => operation.reloadUntilStatusChanged(1000 * 60 * 60 /* minutes */))
        .then(() => this.refresh());
    }
  }
});
