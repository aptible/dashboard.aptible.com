import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['data-environment-provider'],
  classNameBindings: ['size', 'provider']
});
