import Ember from 'ember';
import PaginatedOperations from 'diesel/mixins/routes/paginated-operations';

export default Ember.Route.extend(PaginatedOperations, {
  paginatedResourceOwnerType: 'database',

  model: function(params){
    var database = this.modelFor('database');
    var page = params.currentPage;

    return this.store.find('operation', {database:database, page:page});
  },

  setupController: function(controller, model){
    controller.set('model', model);

    this.setPaginationMeta('operation', this.store, controller);
  }
});
