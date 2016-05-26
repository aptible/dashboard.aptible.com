import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  status: DS.attr('string'),
  approvingAuthorityUserName: DS.attr('string'),
  approvingAuthorityUserEmail:DS.attr('string'),
  approvingAuthorityUrl: DS.attr('string'),
  graph: DS.attr()
});
