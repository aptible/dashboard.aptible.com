import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({
  attributeBindings: ['href', 'target'],
  tagName: 'a',
  app: 'dashboard',
  path: null,
  href: Ember.computed('path', 'app', function() {
    var path = this.get('path');
    var app = this.get('app');
    var host = config.aptibleHosts[app];
    Ember.assert(`The app "${app}" is not a valid argument to link-to-aptible`,
                 !!host);
    return [host, path].join('/');
  })
});
