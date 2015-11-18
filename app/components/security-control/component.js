import Ember from 'ember';

export const DISABLE_PROVIDER_LOGO = ['aptible', 'global'];

export default Ember.Component.extend({
  classNames: ['panel-section security-control'],
  classNameBindings: ['key'],
  showProvider: Ember.computed('provider', function() {
    let provider = this.get('provider');
    return provider && DISABLE_PROVIDER_LOGO.indexOf(provider) < 0;
  })
});
