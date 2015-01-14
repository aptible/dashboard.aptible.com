import Ember from 'ember';

export default Ember.Mixin.create({
  setPaginationMeta: function(controller, type){
    var meta = this.store.metadataFor(type);

    controller.set('currentPage', meta.current_page);
    controller.set('totalCount', meta.total_count);
    controller.set('perPage', meta.per_page);
  },

  actions: {
    goToPage: function(page){
      var controller = this.controller;
      var store = this.store;
      var route = this;
      var query = { page: page };

      var paginatedResourceOwner = this.controller.get('paginatedResourceOwner');
      query[ paginatedResourceOwner.constructor.typeKey ] = paginatedResourceOwner;

      store.find('operation', query).then(function(operations){
        controller.set('operations', operations);

        route.setPaginationMeta(controller, 'operation');
      });
    },

    prevPage: function(currentPage){
      var prevPage = Math.min(currentPage - 1, 1);
      return this.send('goToPage', prevPage);
    },

    nextPage: function(currentPage){
      var nextPage = parseInt(currentPage,10) + 1;
      this.send('goToPage', nextPage);
    }
  }
});
