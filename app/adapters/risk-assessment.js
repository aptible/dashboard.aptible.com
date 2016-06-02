import GridironAdapter from './gridiron';
import Ember from 'ember';
import Inflector from 'ember-inflector';
import buildURLWithPrefixMap from '../utils/build-url-with-prefix-map';

export default GridironAdapter.extend({
  buildURL: buildURLWithPrefixMap({
      'organization_profiles': {
        property: 'organizationProfile.id', only: ['create', 'findquery']
      }
  }),

  pathForType(type) {
    const underscored = Ember.String.underscore(type);
    return Inflector.inflector.pluralize(underscored);
  }
});
