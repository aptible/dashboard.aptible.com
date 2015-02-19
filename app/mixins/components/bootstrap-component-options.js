import Ember from 'ember';

export default Ember.Mixin.create({
  title: null,
  content: null,
  placement: 'bottom',
  'bs-container': 'body',

  // Other possible options:
  //  * bs-trigger
  //  * bs-container

  getBootstrapOptions: function(){
    let options = {
      title: () => this.get('title'),
      content: () => this.get('content'),
      placement: () => this.get('placement'),
    };

    if (this.get('bs-container')) {
      options.container = this.get('bs-container');
    }

    if (this.get('bs-trigger')) {
      options.trigger = this.get('bs-trigger');
    }

    return options;
  }
});
