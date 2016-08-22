import DS from 'ember-data';
import Ember from 'ember';
import User from './user';
import AttestationValidationError from '../utils/attestation-validation-error';

let Attestation = DS.Model.extend({
  handle: DS.attr('string'),
  userUrl: DS.attr('string'),
  userName: DS.attr('string'),
  userEmail: DS.attr('string'),
  schemaId: DS.attr('string'),
  document: DS.attr({ defaultValue: {} }),
  createdAt: DS.attr('iso-8601-timestamp'),
  organizationProfile: DS.belongsTo('organizationProfile', {async: true}),

  setUser(user) {
    Ember.assert('user must be a User model', user instanceof User);

    let userUrl = user.get('data.links.self');
    let userName = user.get('name');
    let userEmail = user.get('email');

    this.setProperties({ userUrl, userName, userEmail });
  },

  validationErrors: Ember.computed('errors.[]', function() {
    let validationErrors = [];
    return this.get('errors').map((e) => AttestationValidationError.create({ message: e.message }));
  })
});

Attestation.reopenClass({
  findOrCreate(params, store) {

    if (!(params.handle && params.organizationProfile)) {
      throw new Error('You must provide both a `handle` and an `organizationProfile` to `Attestation.findOrCreate`');
    }

    let { handle, organizationProfile } = params;

    let findParams = { current: true, handle, organizationProfile };

    return new Ember.RSVP.Promise((resolve) => {
      store.find('attestation', findParams)
        .then((attestations) => {
          // Resolve any attestation returned (should be limited to 1), otherwise
          // instantiate a new attestation and return it
          let attestation = attestations.get('firstObject') ||
                            store.createRecord('attestation', params);
          resolve(attestation);
        })

        // In case of error, just create new attestation
        .catch(() => {
          resolve( store.createRecord('attestation', params));
        });
    });
  }
});

export default Attestation;
