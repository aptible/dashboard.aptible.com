import Ember from "ember";

export default Ember.Route.extend({
  title: function(tokens){
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

  afterModel: function(model){
    // populates for `title` hook
    return model.get('stack');
  }
});
