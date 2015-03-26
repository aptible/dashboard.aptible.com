/** Usage
 * Required parameters: none
 * Optional parameters: none
 *
 * Must be included within a bs-alert like so:

  {{#bs-alert as |component|}}
     Here is some alert information
     {{#bs-alert-dismiss target=component}}
       Click here to dismiss the alert.
     {{/bs-alert}}
  {{/bs-alert}}

  * If used in inline style, this will insert a pulled-right "X" (this is the bootstrap default)

   {{#bs-alert as |component|}}
     {{bs-alert-dismiss target=component}} {{! inline style}}
   {{/bs-alert}}
 */
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  action: 'dismiss',
  classNames: ['bs-alert-dismiss'],

  click: function(e){
    e.preventDefault();

    Ember.assert('bs-alert-dismiss must have a target property set',
                 this.get('target'));

    this.triggerAction({
      action: 'dismiss',
      target: this.get('target')
    });
  }
});
