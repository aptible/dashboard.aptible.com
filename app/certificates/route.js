import Ember from 'ember';

export default Ember.Route.extend({
  title() {
    var stack = this.modelFor('stack');
    return `${stack.get('handle')} Certificates - ${stack.get('organization.name')}`;
  },

  model() {
    var stack = this.modelFor('stack');
    return stack.get('certificates');
  },

  afterModel(model) {
    return Ember.RSVP.all(model.map((certificate) => certificate.get('vhosts')));
  },

  actions: {
    delete: function(model){
      let stack = model.get('stack');

      model.deleteRecord();
      model.save().then(() => {
        let message = `${model.get('commonName')} certificate destroyed`;

        this.transitionTo('certificates', stack);
        Ember.get(this, 'flashMessages').success(message);
      });
    }
  }
});
