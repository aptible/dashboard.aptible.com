import Ember from 'ember';

export default Ember.Component.extend({
  currentPage: 1,
  totalCount: 0,
  perPage: 0,

  hasPrev: function(){
     return this.get('currentPage') > 1;
  }.property('currentPage'),

  hasNext: function(){
    var currentPage = this.get('currentPage'),
        totalCount  = this.get('totalCount'),
        perPage     = this.get('perPage');

     return (totalCount / perPage) > currentPage;
  }.property('currentPage','totalCount','perPage'),

  actions: {
    nextPage: function(currentPage){
      this.sendAction('nextPage', currentPage);
    },
    prevPage: function(currentPage){
      this.sendAction('prevPage', currentPage);
    }
  }
});
