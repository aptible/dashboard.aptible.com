/**
 * Usage
 *
 * Required params: none
 * Optional params:
 *   * alert: name of alert. Default: 'warning'
 *
  {{#bs-alert alert='success'}}
    Here is some success alert text
  {{/bs-alert}}

 * Use {{#bs-alert-dismiss}} to add a 'dismiss' button
 */
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['alert'],
  classNameBindings: 'alertClass',
  isVisible: true,
  attributeBindings: ['role'],
  role: 'alert',

  alert: 'warning',
  alertClass: function(){
    return `alert-${this.get('alert')}`;
  }.property('alert'),

  actions: {
    dismiss: function(){
      this.set('isVisible', false);
    }
  }
});
