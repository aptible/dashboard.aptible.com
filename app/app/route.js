import Ember from "ember";

export default Ember.Route.extend({
  title(tokens) {
    if (tokens.length === 0) {
      tokens.push(this.currentModel.get('handle'));
    }

    // stack will be a PromiseProxy, already populated because of
    // the fetch for it from the `afterModel` hook
    let stack = this.currentModel.get('stack');
    Ember.assert('App Route must have a stack', !!stack);

    tokens.push(stack.get('handle'));
    return tokens.join(' - ');
  },

  afterModel(model) {
    return model.get('stack');
  },

  setupController(controller, model) {
    controller.set('model', model);
    // FIXME: aptible-ability depends on an instance method on the stacks model.
    // Because of this, we need to explicitly return the stack model,
    // rather than the promise proxy.  Once aptible-ability is able to handle
    // promise proxies, this line can be updated to model.get('stack')
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
