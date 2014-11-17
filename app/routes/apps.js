import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return [
      {handle:'app1'},
      {handle:'app2'}
    ];
  }
});
