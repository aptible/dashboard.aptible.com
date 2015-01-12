import Ember from 'ember';
import Paginated from "diesel/mixins/routes/paginated";

export default Ember.Route.extend(Paginated, {
  model: function(params, transition){
    var db = this.modelFor('databases.show');
    var page = parseInt(transition.queryParams.page || 1, 10);

    return this.store.find('operation', {database:db, page:page});
  },

  setupController: function(controller, model){
    var db = this.modelFor('databases.show');
    controller.set('operations', model);
    controller.set('paginatedResourceOwner', db);

    this.setPaginationMeta(controller, 'operation');
  }
});
