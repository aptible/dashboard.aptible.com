import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

// registers test helpers for injection
import './aptible-helpers';
import './organization-stub';
import './set-feature';

export default function startApp(attrs) {
  let application;

  let attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(function() {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
