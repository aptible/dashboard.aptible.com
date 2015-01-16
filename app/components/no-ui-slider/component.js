import Ember from 'ember';

// see http://refreshless.com/nouislider/ for details
// This component does not support all the options for nouislider
export default Ember.Component.extend({
  classNames: ['slider'],

  start: 0,
  rangeMin: 0,
  rangeMax: 0,
  step: null,

  initializeSlider: function(){
    var options = {
      start: [this.get('start')],
      range: {
        min: [this.get('rangeMin')],
        max: [this.get('rangeMax')]
      },
      connect: 'lower'
    };

    var step = this.get('step');
    if (step) { options.step = step; }

    this.$().noUiSlider(options);
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

  removeEventListeners: function(){
    this.$().off('slide');
    this.$().off('set');
  }.on('willDestroyElement')
});
