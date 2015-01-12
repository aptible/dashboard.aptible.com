import Ember from 'ember';
import Paginated from "diesel/mixins/routes/paginated";

export default Ember.Route.extend(Paginated, {
  model: function(params, transition){
    var app = this.modelFor('apps.show');
    var page = parseInt(transition.queryParams.page || 1, 10);

    return this.store.find('operation', {app:app, page:page});
  },

  setupController: function(controller, model){
    var app = this.modelFor('apps.show');
    controller.set('operations', model);
    controller.set('paginatedResourceOwner', app);

    this.setPaginationMeta(controller, 'operation');
  }
});
