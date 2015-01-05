import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':col-sm-3', 'isSelected:selected-option'],

  dbType:null,
  selectedDbType: null,
  selectCallback: Ember.K,

  isSelected: Ember.computed('dbType', 'selectedDbType', function(){
    return this.get('dbType') === this.get('selectedDbType');
  }),

  actions: {
    selectDbType: function(dbType){
      this.get('selectCallback')(dbType);
    }
  }
});
