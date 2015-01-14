import Ember from 'ember';
import Paginated from "diesel/mixins/routes/paginated";

export default Ember.Route.extend(Paginated, {
  model: function(params){
    var db = this.modelFor('databases.show');
    var page = params.currentPage || 1;

    return this.store.find('operation', {database:db, page:page});
  },

  setupController: function(controller, model){
    var db = this.modelFor('databases.show');
    controller.set('operations', model);
    controller.set('paginatedResourceOwner', db);

    this.setPaginationMeta(controller, 'operation');
  }
});
