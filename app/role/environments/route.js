import Changeset from "diesel/utils/changeset";
import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Route.extend({
  init() {
    this._super();
    this._stacks = null;
    this._organization = null;
  },

  afterModel(model){
    const promises = [];
    this._organization = model.get('organization');

    promises.push(this._organization);
    promises.push(this.store.findStacksFor(this._organization).then((stacks) => {
      this._stacks = stacks;
      // stacks.forEach((stack) => {
      //   promises.push(stack.get('apps'));
      //   promises.push(stack.get('databases'));
      // });
    }));
    return Ember.RSVP.all(promises);
  },

  setupController(controller, model){
    controller.set('model', model);
    controller.set('stacks', this._stacks);
    controller.set('organization', this._organization);
  }
});
