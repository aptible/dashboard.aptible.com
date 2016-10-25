import Ember from 'ember';
import SIX_POINT_SCALE from 'diesel/utils/six-point-scale';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['six-point-scale-badge'],
  classNameBindings: ['levelClassname'],
  point: Ember.computed('value', function() {
    return SIX_POINT_SCALE.findBy('value', this.get('value'));
  }),

  levelClassname: Ember.computed('title', function() {
    return Ember.String.dasherize(this.get('title'));
  }),

  title: Ember.computed('point', function() {
    return this.get('point.title');
  })
});
