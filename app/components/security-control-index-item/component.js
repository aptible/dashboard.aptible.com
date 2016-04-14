import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['security-control-index-item'],
  classNameBindings: ['isLoading'],
  isLoading: Ember.computed.alias('securityControlGroup.isLoading')
});
