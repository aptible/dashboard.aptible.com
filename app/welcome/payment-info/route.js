import Ember from 'ember';
import { createStripeToken } from '../../utils/stripe';

export default Ember.Route.extend({
  model: function() {
    return {
      // TODO: should come from the link they click
      // on the sales site to visit the signup flow
      plan: 'development'
    };
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    var firstApp = this.modelFor('welcome');
    controller.set('firstApp', firstApp);
  },

  actions: {
    create: function(model) {
      var route = this;
      var store = this.store;
      var controller = this.controllerFor('welcome/payment-info');

      var welcomeModel = this.modelFor('welcome');

      var options = {
        name: model.name,
        number: model.number,
        exp_month: model.expMonth,
        exp_year: model.expYear,
        cvc: model.cvc,
        address_zip: model.zip
      };

      var organization, stack;

      Ember.RSVP.hash({
        stripeResponse: createStripeToken(options),
        // TODO: the organization should probabaly be loaded
        // when the route is entered and the name displayed when
        // entering payment information
        organizations: store.find('organization')
      }).then(function(result) {
        organization = result.organizations.objectAt(0);
        var subscription = store.createRecord('subscription', {
          plan: model.plan,
          stripeToken: result.stripeResponse.id,
          organization: organization
        });
        return subscription.save();
      }).then(function(){
        var promises = [];
        var organizationUrl = organization.get('_data.links.self');

        var devStack = store.createRecord('stack', {
          handle: `${welcomeModel.stackHandle}-dev`,
          type: 'development',
          organizationUrl: organizationUrl
        });
        promises.push(devStack.save());

        if (model.plan !== 'development') {
          var prodStack = store.createRecord('stack', {
            handle: `${welcomeModel.stackHandle}-prod`,
            type: 'production',
            organizationUrl: organizationUrl
          });
          promises.push(prodStack.save());
        }

        return Ember.RSVP.all(promises);
      }).then(function(stacks){
        stack = stacks[0]; // development stack is first

        var promises = [];
        if (welcomeModel.appHandle) {
          var app = store.createRecord('app', {
            handle: welcomeModel.appHandle,
            stack: stack
          });
          promises.push(app.save());
        }

        if (welcomeModel.dbHandle) {
          var db = store.createRecord('database', {
            handle: welcomeModel.dbHandle,
            type: welcomeModel.dbType,
            stack: stack
          });
          promises.push(db.save());
        }

        return Ember.RSVP.all(promises);
      }).then(function(){
        route.transitionTo('index');
      }, function(error) {
        controller.set('error', error);
      });
    }
  }
});
