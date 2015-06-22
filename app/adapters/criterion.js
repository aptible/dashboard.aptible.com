import GridironAdapter from './gridiron';
import Ember from 'ember';

export default GridironAdapter.extend({
  currentOrganization: Ember.inject.service('currentOrganization'),

  findHasMany: function(store, record, url) {
    let organizationHref = this.get('currentOrganization.organizationHref');
    url = url.replace(/\{\?organization\}/, `?organization=${organizationHref}`);
    return this._super(store, record, url);
  },

  pathForType: function(type){
    if(type === 'criterion') {
      return 'criteria';
    }

    return this._super(type);
  }
});