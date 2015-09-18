import Ember from 'ember';
import fetchAllPages from '../utils/fetch-all-pages';

export default Ember.Route.extend({
  title: function(){
    var stack = this.modelFor('stack');
    return `${stack.get('handle')} Databases - ${stack.get('organization.name')}`;
  },
  model: function(){
    var stack = this.modelFor('stack');
    var databases = stack.get('databases');

    var promise = databases.get('isFulfilled') ? databases.reload() : Ember.RSVP.resolve();

    return promise
      .then(() => {
        return fetchAllPages(this.store, stack, 'database');
      });
  }
});
