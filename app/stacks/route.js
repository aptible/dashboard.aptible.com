import Ember from 'ember';

export default Ember.Route.extend({

  model: function(){
    // TODO: This is incorrect. This should only be the stacks
    // on the current organization. Needs to be added to
    // the API.
    return this.store.find('stack');
  }

});
