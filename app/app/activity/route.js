import Ember from 'ember';
import PaginatedOperations from 'diesel/mixins/routes/paginated-operations';

export default Ember.Route.extend(PaginatedOperations, {
  paginatedResourceOwnerType: 'app',

  model: function(params){
    var app = this.modelFor('app');
    var page = params.currentPage;

    return this.store.find('operation', {app:app, page:page});
  },

  setupController: function(controller, model){
    controller.set('model', model);

    this.setPaginationMeta('operation', this.store, controller);
  }
});
