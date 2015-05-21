import Ember from "ember";

export default Ember.Route.extend({
  title: function(tokens){
    if (tokens.length === 0) {
      tokens.push(this.currentModel.get('handle'));
    }
    var stack = this.currentModel.get('stack');
    tokens.push(stack.get('handle'));
    return tokens.join(' - ');
  },

  afterModel: function(model){
    return model.get('stack');
  },

  setupController: function(controller, model){
    controller.set('model', model);
    controller.set('stack', model.get('stack.content'));
  },

  renderTemplate() {
    this._super.apply(this, arguments);
    this.render('sidebars/stack', {
      into: 'dashboard',
      outlet: 'sidebar'
    });
  }
});
