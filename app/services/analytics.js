import Ember from 'ember';
import config from '../config/environment';

function load(){
  if (window.analytics) {
    return;
  }

  // From https://segment.com/docs/libraries/analytics.js/quickstart/#step-2-identify-users
  // Create a queue, but don't obliterate an existing one!
  var analytics = window.analytics = window.analytics || [];

  // If the real analytics.js is already on the page return.
  if (analytics.initialize) {
    return;
  }

  // If the snippet was invoked already show an error.
  if (analytics.invoked) {
    if (window.console && console.error) {
      console.error('Segment snippet included twice.');
    }
    return;
  }

  // Invoked flag, to make sure the snippet
  // is never invoked twice.
  analytics.invoked = true;

  // A list of the methods in Analytics.js to stub.
  analytics.methods = [
    'trackSubmit',
    'trackClick',
    'trackLink',
    'trackForm',
    'pageview',
    'identify',
    'group',
    'track',
    'ready',
    'alias',
    'page',
    'once',
    'off',
    'on'
  ];

  // Define a factory to create stubs. These are placeholders
  // for methods in Analytics.js so that you never have to wait
  // for it to load to actually record data. The `method` is
  // stored as the first argument, so we can replay the data.
  analytics.factory = function(method){
    return function(){
      var args = Array.prototype.slice.call(arguments);
      args.unshift(method);
      analytics.push(args);
      return analytics;
    };
  };

  // For each of our methods, generate a queueing stub.
  for (var i = 0; i < analytics.methods.length; i++) {
    var key = analytics.methods[i];
    analytics[key] = analytics.factory(key);
  }

  // Define a method to load Analytics.js from our CDN,
  // and that will be sure to only ever load it once.
  analytics.load = function(key){
    // Create an async script element based on your key.
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'cdn.segment.com/analytics.js/v1/' + key + '/analytics.min.js';

    // Insert our script next to the first script element.
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(script, first);
  };

  analytics.load(config.segmentioKey);

  // Add a version to keep track of what's in the wild.
  analytics.SNIPPET_VERSION = '3.0.1';
}

export default Ember.Service.extend({

  hasEmail: undefined,

  init: function(){
    load();
    Ember.assert("Analytics service expects window.analytics to be present", !!window.analytics);
    var service = this;
    window.analytics.ready(function(){
      Ember.run(function(){
        service.updateEmailStatus();
      });
    });
  },

  showChat: function(initialMessage){
    return this.identify().then(function(){
      window.Intercom('showNewMessage', initialMessage);
    });
  },

  identify: function(id, attributes){
    attributes = attributes || {};
    let service = this;

    return new Ember.RSVP.Promise(function(resolve) {
      if(config.environment !== 'test') {
        window.analytics.identify(id, attributes, Ember.run.bind(null, resolve));
      } else {
        resolve();
      }
    }).then(function() {
      service.updateEmailStatus();
    });
  },

  updateEmailStatus: function(){
    var user = window.analytics.user();
    var traits = user.traits();
    this.set('hasEmail', !!traits.email);
  },

  page: function(name){
    return new Ember.RSVP.Promise(function(resolve){
      window.analytics.page(name, Ember.run.bind(null, resolve));
    });
  }
});