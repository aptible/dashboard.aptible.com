import Ember from 'ember';
import fetchAllPages from '../utils/fetch-all-pages';

export default Ember.Route.extend({
  title: function(){
    var stack = this.modelFor('stack');
    return `${stack.get('handle')} Apps - ${stack.get('organization.name')}`;
  },
  model: function(){
    var stack = this.modelFor('stack');
    var apps = stack.get('apps');

    var promise = apps.get('isFulfilled') ? apps.reload() : Ember.RSVP.resolve();

    return promise
      .then(() => {
        return fetchAllPages(this.store, stack, 'app');
      });
  }
});
