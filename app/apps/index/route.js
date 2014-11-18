import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return [
      {handle:'app1', id: 'app1'},
      {handle:'app2', id: 'app2'}
    ];
  }
});
