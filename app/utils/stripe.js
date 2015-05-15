/* globals Stripe */

import jQuery from 'jquery';
import Ember from 'ember';
import config from '../config/environment';

var loadPromise;

function load(){
  if(!loadPromise) {
    if (window.Stripe) {
      loadPromise = Ember.RSVP.resolve();
    } else {
      loadPromise = new Ember.RSVP.Promise(function(resolve, reject) {
        jQuery.getScript('https://js.stripe.com/v2/').then(Ember.run.bind(null, resolve), Ember.run.bind(null, reject));
      }).then(function() {
        Stripe.setPublishableKey(config.stripePublishableKey);
      });
    }
  }

  return loadPromise;
}

function createStripeToken(options) {
  return load().then(function() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Stripe.card.createToken(options, function(status, result) {
        if(result.error) {
          Ember.run(null, reject, result.error);
        } else {
          Ember.run(null, resolve, result);
        }
      });
    });
  });
}

export { createStripeToken };