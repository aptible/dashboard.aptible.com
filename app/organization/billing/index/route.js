import Ember from 'ember';

function arrayReduce(arr) {
  return arr.reduce((prev, curr) => {
    if(curr) {
      return prev.toArray().concat(curr.toArray());
    }

    return prev;
  }, Ember.A([]));
}

export default Ember.Route.extend({
  model() {
    let context = this.modelFor('organization');
    let stacks = context.get('stacks');
    let databases = Ember.RSVP.all(stacks.map((stack) => stack.get('databases')))
                                  .then((dbs) => arrayReduce(dbs));
    let apps = Ember.RSVP.all(stacks.map((stack) => stack.get('apps')))
                             .then((apps) => arrayReduce(apps));
    let appServices = apps.then((app) => arrayReduce(app.map((a) => a.get('services'))));
    let dbServices = databases.then((dbs) => {
      return Ember.RSVP.all(dbs.map((db) => db.get('service')).filter((service) => service));
    });
    let services = Ember.RSVP.all([appServices, dbServices])
                                 .then((s) => arrayReduce(s));

    return Ember.RSVP.hash({
      apps: apps,
      stacks: stacks,
      services: services,
      databases: databases
    });
  },

  setupController(controller, model) {
    let context = this.modelFor('organization');
    let organization = context.get('organization');
    let billingDetail = context.get('billingDetail');
    let { stacks, apps, databases, services } = model;
    services = services.filter((service) => service !== null);

    controller.setProperties({ services, stacks, apps, databases, organization,
                               billingDetail});
  }
});
