import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({
  attributeBindings: ['href'],
  tagName: 'a',
  app: 'dashboard',
  path: null,
  href: function(){
    var path = this.get('path');
    var app = this.get('app');
    var host = config.aptibleHosts[app];
    return [host, path].join('/');
  }.property('path', 'app')
});
