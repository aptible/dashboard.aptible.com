import Ember from 'ember';

export default Ember.Component.extend({
  root: 'assets/images/data-environments',
  classNames: ['data-environment-provider'],
  classNameBindings: ['size', 'provider'],
  path: Ember.computed('provider', function() {
    let { root, provider } = this.getProperties('root', 'provider');
    return `${root}/${provider}.png`;
  })
});
