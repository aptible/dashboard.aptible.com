import Ember from "ember";

export default Ember.Route.extend({
  titleToken: function(){
    var app = this.modelFor('app');
    return `${app.get('handle')} Domains`;
  }
});
