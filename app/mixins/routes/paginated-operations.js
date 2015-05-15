import Ember from 'ember';

export default Ember.Mixin.create({
  titleToken: function(){
    let resource = this.modelFor( this.get('paginatedResourceOwnerType') );
    return `${resource.get('handle')} Activity`;
  },

  setPaginationMeta: function(typeName, store, controller){
    var pagination = store.metadataFor(typeName);
    controller.set('currentPage', pagination.current_page);
    controller.set('totalCount', pagination.total_count);
    controller.set('perPage', pagination.per_page);
  },

  actions: {
    goToPage: function(page){
      var paginatedResourceOwnerType = this.get('paginatedResourceOwnerType');

      Ember.assert('Routes mixing in Pagination must set a paginatedResourceOwnerType',
                   paginatedResourceOwnerType);

      var controller = this.controller;
      var store = this.store;
      var route = this;
      var query = {page:page};
      var paginatedResourceOwner = this.modelFor(paginatedResourceOwnerType);
      query[ paginatedResourceOwnerType ] = paginatedResourceOwner;

      this.store.find('operation', query).then(function(operations){
        controller.set('model', operations);
        route.setPaginationMeta('operation', store, controller);
      });
    },
    nextPage: function(page){
      this.send('goToPage', page + 1);
    },
    prevPage: function(page){
      this.send('goToPage', page - 1);
    }
  }
});
