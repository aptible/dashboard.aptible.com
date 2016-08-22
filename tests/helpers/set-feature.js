import Ember from 'ember';

function setFeature(app, featureName, value) {
  var service = app.__container__.lookup('features:-main');
  service[value ? 'enable' : 'disable'](featureName);
}

Ember.Test.registerHelper('setFeature', setFeature);

export default setFeature;
