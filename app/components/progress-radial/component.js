import Ember from 'ember';

export default Ember.Component.extend({
  circumference: Ember.computed('radius', function() {
    return Math.floor(2 * Math.PI * this.get('radius'));
  }),

  diameter: Ember.computed('radius', function() {
    return this.get('radius') * 2;
  }),

  length: Ember.computed('radius', 'strokeWidth', function() {
    return (this.get('radius') + this.get('strokeWidth')) * 2;
  }),

  halfLength: Ember.computed('radius', 'strokeWidth', function() {
    return this.get('radius') + this.get('strokeWidth');
  }),

  // Animate the completed count and radial guage when the element is in the DOM.
  didInsertElement: function() {
    let { circumference, completed, total } = this.getProperties('circumference', 'completed', 'total');
    let dashOffset = 0;
    let intervalMS = Math.ceil(2000 / completed);
    let percent = 0;

    // jQuery wrapped element references
    let $completed = this.$('.completed');
    let $svgGuagePath = this.$('.progress-radial-guage-path');

    // Skip animating initial values.
    if (completed === 0) { return; }

    // Update the completed amount to count up as the radial guage animates.
    for (let i = 1; i <= completed; i++) {
      let $completed = this.$('.completed');
      let val = parseInt($completed.text()) + i;
      Ember.run.later(() => {
        $completed.text(val);
      }, (intervalMS * val));
    }

    // Keep percent in bounds
    if (completed > 0) {
      percent = Math.min(1, completed / total);
    }
    dashOffset = Math.floor(circumference - (circumference * (percent)));

    // New thread for the radial guage animated transition.
    Ember.run.later(() => {
      $svgGuagePath.css('stroke-dashoffset', dashOffset);
    }, 1);
  }
});
