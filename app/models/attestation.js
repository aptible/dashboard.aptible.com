import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  handle: DS.attr('string'),
  document: DS.attr({ defaultValue: {} })
});
