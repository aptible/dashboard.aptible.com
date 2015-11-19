import GridironAdapter from './gridiron';
import Ember from "ember";
import Inflector from 'ember-inflector';

export default GridironAdapter.extend({
  pathForType: function(type) {
    const underscored = Ember.String.underscore(type);
    return Inflector.inflector.pluralize(underscored);
  }
});
