import Ember from 'ember';

const setPaginationMeta = function(typeName, store, controller) {
  var pagination = store.metadataFor(typeName);
  controller.set('currentPage', pagination.current_page);
  controller.set('totalCount', pagination.total_count);
  controller.set('perPage', pagination.per_page);
};

export default Ember.Mixin.create({
  // Methods to override
  getPaginatedResourceType() {
    Ember.assert('Must override getPaginatedResourceType');
  },

  composeQuery() {
    Ember.assert('Must override composeQuery');
  },

  // Ember hooks
  model(params) {
    return this.fetchResources(params.currentPage);
  },

  setupController: function(controller, model){
    controller.set('model', model);
    setPaginationMeta(this.getPaginatedResourceType(), this.store, controller);
  },

  actions: {
    goToPage(page) {
      return this.fetchResources(page).then((resources) => {
        this.controller.set('model', resources);
        setPaginationMeta(this.getPaginatedResourceType(), this.store, this.controller);
      });
    },

    nextPage(page) {
      this.send('goToPage', page + 1);
    },

    prevPage(page) {
      this.send('goToPage', page - 1);
    }
  },

  // Helpers
  fetchResources: function(page) {
    return this.store.find(this.getPaginatedResourceType(), this.composeQuery(page));
  },
});
