import GridironAdapter from './gridiron';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';
import Ember from "ember";
import Inflector from 'ember-inflector';

export default GridironAdapter.extend({
  pathForType: function(type) {
    const underscored = Ember.String.underscore(type);
    return Inflector.inflector.pluralize(underscored);
  }
});