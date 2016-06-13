import Ember from 'ember';
import PaginatedOperations from 'diesel/mixins/routes/paginated-operations';

export default Ember.Route.extend(PaginatedOperations, {
  getPaginatedResourceOwnerType: () => 'database'
});
