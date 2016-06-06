import Ember from 'ember';

export default Ember.Mixin.create({
  title: null,
  content: null,
  placement: 'bottom',
  'bs-container': 'body',

  // Other possible options:
  //  * bs-trigger
  //  * bs-container
  //  * bs-html

  getBootstrapOptions: function(){
    // These will return functions, which is fine, because bootstrap
    // explicitly accepts callables for those attributes.
    let options = {
      title: () => this.get('title'),
      content: () => this.get('content'),
      placement: () => this.get('placement')
    };

    // NOTE: Bootstrap does not accept a callable for html, so we need to make
    // sure this isn't accidentally set to a function, which might
    // (unintentionally) evaluate to true!
    options.html = (this.get('bs-html') === true);

    if (this.get('bs-container')) {
      options.container = this.get('bs-container');
    }

    if (this.get('bs-trigger')) {
      options.trigger = this.get('bs-trigger');
    }

    return options;
  }
});
