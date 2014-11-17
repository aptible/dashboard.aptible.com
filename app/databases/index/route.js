import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return [
      {handle:'database1', id: 'database1'},
      {handle:'database2', id: 'database2'}
    ];
  }
});
