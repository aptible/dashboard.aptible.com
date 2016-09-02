import Ember from 'ember';

export default Ember.Route.extend({
  title() {
    var stack = this.modelFor('stack');
    return `Create a Database - ${stack.get('handle')}`;
  },

  model() {
    var stack = this.modelFor('stack');
    return Ember.RSVP.hash({
      databaseImages: this.store.find('database-image'),
      database: this.store.createRecord('database', {
        stack: stack,
        type: 'postgresql'
      })
    });
  },

  setupController(controller, model) {
    controller.set('model', model.database);
    controller.set('databaseImages', model.databaseImages);
  },

  renderTemplate(controller) {
    if (!this.session.get('currentUser.verified')) {
      controller.set('resourceType', 'database');
      this.render('unverified');
    } else {
      this._super.apply(this, arguments);
    }
  },

  resetController() {
    this.controller.set('diskSize', 10);
  },

  actions: {
    willTransition() {
      this.currentModel.rollback();
    },

    create() {
      var db = this.currentModel.database,
          route = this,
          controller = this.controller,
          store = this.store;

      db.save().then(() => {
        var op = store.createRecord('operation', {
          type: 'provision',
          diskSize: controller.get('diskSize'),
          database: db
        });

        return op.save();
      }).then(() => {
        let message = `${db.get('handle')} database created`;

        route.transitionTo('databases.index');
        Ember.get(this, 'flashMessages').success(message);
      }, (e) => {
        if(db.get('isValid')) {
          let message = Ember.get(e, 'responseJSON.message') || `There was an error saving ${db.get('handle')}`;
          Ember.get(this, 'flashMessages').danger(message);
        }
      });
    },

    cancel() {
      this.transitionTo('databases.index');
    }
  }
});
