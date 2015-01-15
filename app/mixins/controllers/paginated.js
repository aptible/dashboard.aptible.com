import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: [{currentPage: {as: 'page', refreshModel:true}}],

  currentPage: 1
});
