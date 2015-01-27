import Ember from 'ember';
import { createStripeToken } from '../../utils/stripe';

export default Ember.Route.extend({

  actions: {
    create: function(model) {
      var route = this;
      var store = this.store;
      var controller = this.controllerFor('welcome/payment-info');

      var options = {
        name: model.name,
        number: model.number,
        exp_month: model.expMonth,
        exp_year: model.expYear,
        cvc: model.cvc,
        address_zip: model.zip
      };

      Ember.RSVP.hash({
        stripeResponse: createStripeToken(options),
        // TODO: the organization should probabaly be loaded
        // when the route is entered and the name displayed when
        // entering payment information
        organizations: store.find('organization')
      }).then(function(result) {
        var subscription = store.createRecord('subscription', {
          plan: 'development',
          stripeToken: result.stripeResponse.id,
          organization: result.organizations.objectAt(0)
        });
        return subscription.save();
      }).then(function(){
        // TODO: Change to verification page when ready
        route.transitionTo('index');
      }, function(error) {
        controller.set('error', error);
      });
    }
  }
});
