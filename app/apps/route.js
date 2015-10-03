import Ember from 'ember';
import fetchAllPages from '../utils/fetch-all-pages';

export default Ember.Route.extend({
  title: function(){
    var stack = this.modelFor('stack');
    return `${stack.get('handle')} Apps`;
  },

  model: function(){
    var stack = this.modelFor('stack');
    return fetchAllPages(this.store, stack, 'app');
  }
});
