import Ember from 'ember';
import Paginated from 'diesel/mixins/routes/paginated';

export default Ember.Mixin.create(Paginated, {
  // Methods to override
  getPaginatedResourceOwnerType() {
    Ember.assert('Must override getPaginatedResourceOwnerType');
  },

  // Paginated hooks
  getPaginatedResourceType: () => 'operation',

  composeQuery(page) {
    const paginatedResourceOwnerType = this.getPaginatedResourceOwnerType();
    const paginatedResourceOwner = this.modelFor(paginatedResourceOwnerType);

    const query = {page: page};
    query[paginatedResourceOwnerType] = paginatedResourceOwner;
    return query;
  },

  // Ember hooks
  titleToken: function(){
    let resource = this.modelFor(this.getPaginatedResourceOwnerType());
    return `${resource.get('handle')} Activity`;
  },
});
