import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['dropTargetActive'],

  dropTargetActive: false,

  doneReading: function(event) {
    let file = event.target;
    this.set('value', Ember.getWithDefault(this, 'value', '') + file.result);
  },

  dragEnter: function() {
    this.set('dropTargetActive', true);
  },

  dragLeave: function() {
    this.set('dropTargetActive', false);
  },

  drop: function(event) {
    event.stopPropagation();
    event.preventDefault();
    this.set('dropTargetActive', false);
    for (var i in event.dataTransfer.files) {
      try {
        let reader = new FileReader();
        let file = event.dataTransfer.files[i];

        reader.onload = Ember.run.bind(this, this.doneReading);
        reader.readAsText(file);
      }
      catch(error) {}
    }
  }
});
