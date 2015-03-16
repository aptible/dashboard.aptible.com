/**
 * Usage
 *
 * Required params:
 *   * title: The text to be displayed in the tooltip
 * Optional params:
 *   * placement: 'left','right','top','bottom' (default: 'bottom')
 *   * bs-trigger: The triggering event ('click', 'focus', etc.). Default: none
 *   * bs-container: The container to use for the tooltip (e.g., 'body'). Default: none
 *
  {{#bs-tooltip title='The tooltip text'}}
    Hover over this text to see the tooltip.
  {{/bs-tooltip}}
 */
import Ember from 'ember';
import BootstrapComponentOptions from 'diesel/mixins/components/bootstrap-component-options';

export default Ember.Component.extend(BootstrapComponentOptions, {
  tagName: 'span',

  setupTooltip: function(){
    var options = this.getBootstrapOptions();
    var tooltip = this.$(':first-child').tooltip(options);

    if(options.trigger = 'immediate') { tooltip.tooltip('show'); }
  }.on('didInsertElement')
});
