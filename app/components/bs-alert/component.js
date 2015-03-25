/**
 * Usage
 *
 * Required params: none
 * Optional params:
 *   * alert: name of alert. Default: 'warning'
 *   * action: This action will be sent when the alert is dismissed.
 *             This can be necessary to ensure the bs-alert is cleared and
 *             re-rendered when it is reused to display multiple messages on a page.
 *             See https://github.com/aptible/diesel.aptible.com/issues/223
 *
  {{#bs-alert action="clearSuccessMessage" alert='success' as |component|}}
    {{bs-alert-dismiss target=component}} {{! when dismissed, "clearSuccessMessage" action is sent}}
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
      this.sendAction();
    }
  }
});
