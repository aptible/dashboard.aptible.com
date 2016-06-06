/**
 * Usage
 *
 * Required params:
 *   * title: The text to be displayed in the popover title
 *   * content: The text to be displayed in the popover body
 * Optional params:
 *   * placement: 'left','right','top','bottom' (default: 'bottom')
 *   * bs-html: Whether HTML should be allowed. Default: false
 *   * bs-trigger: The triggering event ('click', 'focus', etc.). Default: none
 *   * bs-container: The container to use for the tooltip (e.g., 'body'). Default: none
 *
  {{#bs-popover title='The title' content='The popover body' bs-container='body' placement='right' bs-trigger='focus'}}
    <input type='text' />
  {{/bs-popover}}
 */
import Ember from 'ember';
import BootstrapComponentOptions from '../../mixins/components/bootstrap-component-options';

export default Ember.Component.extend(BootstrapComponentOptions, {
  tagName: 'span',

  setupPopover: Ember.on('didInsertElement', function(){
    this.$(':first-child').popover(this.getBootstrapOptions());
  })
});
