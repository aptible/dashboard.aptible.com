import Ember from "ember";

export default Ember.Route.extend({
  model: function(){
    // TODO: This should be scoped to the relative app
    return [
      { virtualDomain: 'www.appyapp.com' }
    ];
  }
});
