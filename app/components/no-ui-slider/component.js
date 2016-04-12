import Ember from 'ember';

// see http://refreshless.com/nouislider/ for details
// This component does not support all the options for nouislider
export default Ember.Component.extend({
  classNames: ['slider'],

  start: 0,
  rangeMin: 0,
  rangeMax: 0,
  step: null,

  validateProperties: function(){
    Ember.assert('no-ui-slider must have a value for `start`',
      !Ember.isBlank(this.get('start')));
  }.on('init'),

  initializeSlider: function(){
    var max = this.get('rangeMax');
    var range = {
      min: [this.get('rangeMin')],
      max: [max]
    };

    var rangeOptions = this.get('range');
    if (rangeOptions) {
      var values = rangeOptions.split(',').filter(function(val) {
        return val !== max;
      });
      var num = values.length;

      var arr = values.map(function(e, i) {
        var percent = ((100 / num) * i);
        var value = {};
        value[percent + '%'] = parseInt(values[i]);
        return value;
      }).reduce(function(a, b) {
        return Ember.merge(a, b);
      });

      range = Ember.merge(range, arr);
    }

    var options = {
      start: [this.get('start')],
      range: range,
      connect: 'lower'
    };

    var step = this.get('step');
    if (step) { options.step = step; }

    var snap = this.get('snap');
    if (snap) { options.snap = snap; }

    let element = this.$();
    element.noUiSlider(options);

    var disabled = this.get('disabled');
    if (disabled) { element.attr('disabled', true); }

    this.setupEventListeners();
  }.on('didInsertElement'),

  setupEventListeners: function(){
    var component = this;

    // `slide` event fired continuously during slide
    this.$().on('slide', function(e, value){
      value = parseFloat(value);

      Ember.run(component, 'sendAction', 'didSlide', value);
    });

    // `set` event fired once when user stops dragging/sliding
    this.$().on('set', function(e, value){
      value = parseFloat(value);

      Ember.run(component, 'sendAction', 'didSet', value);
    });
  },

  disabledObserver: function() {
    let element = this.$();
    element.attr('disabled', this.get('disabled'));
  }.observes('disabled'),

  removeEventListeners: function(){
    this.$().off('slide');
    this.$().off('set');
  }.on('willDestroyElement')
});
