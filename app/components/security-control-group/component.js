import Ember from 'ember';
import { DISABLE_PROVIDER_LOGO } from '../security-control/component';
import loadSchema from 'sheriff/utils/load-schema';
import Attestation from 'sheriff/models/attestation';

export const LOADING_STATES_LABELS = {
  securityControls: 'Loading Security Controls',
  answers: 'Loading Existing Answers'
};

export default Ember.Component.extend({
  store: Ember.inject.service(),

  classNames: ['security-control-group'],
  classNameBindings: ['loading'],
  loading: true,
  progressPercent: 0,
  error: null,
  errorMessage: Ember.computed('error', function() {
    let error = this.get('error');
    if (!error) {
      return null;
    }

    return error.replace("The property '#/' did not contain a required property of",
                         'Missing required property: ');
  }),

  progressMessage: LOADING_STATES_LABELS.securityControls,

  provider: Ember.computed.alias('securityControlGroup.provider'),

  showProvider: Ember.computed('provider', function() {
    let provider = this.get('provider');
    return provider && DISABLE_PROVIDER_LOGO.indexOf(provider) < 0;
  }),

  title: Ember.computed.alias('schema.schema.title'),

  progressWidth: Ember.computed('progressPercent', function() {
    return `width:${this.get('progressPercent')}%`;
  }),

  init() {
    this._super(...arguments);
    let securityControlGroup = this.get('securityControlGroup');

    loadSchema(securityControlGroup.handle).then((s) => this.onSchemaLoad(s));
  },

  onSchemaLoad(schema) {
    let store = this.get('store');
    let organizationUrl = this.get('organizationUrl');
    let securityControlGroup = this.get('securityControlGroup');
    let attestationParams = { handle: securityControlGroup.handle,
                              schemaId: schema.id, organizationUrl, document: {} };

    securityControlGroup.attestation = Attestation.findOrCreate(attestationParams, store)
                                                  .then((a) => this.onAttestationLoad(a));

    this.setProperties({ schema, progressPercent: '50',
                         progressMessage: LOADING_STATES_LABELS.answers });
  },


  onAttestationLoad(attestation) {
    let { securityControlGroup, schema } = this.getProperties('securityControlGroup', 'schema');
    let document = schema.buildDocument();

    // Export attestation and document, used when saving from route
    securityControlGroup.attestation = attestation;
    securityControlGroup.document = document;

    // TODO: We can't load attestations created against a different schema
    // id in the UI--properties could have been added/removed.
    //
    // We should inspect the document and schema versions to determine a
    // course of action. Given MAJOR, MINOR, or PATCH revision changes,
    // we should:
    //
    // MAJOR:
    // Dump the whole document and start anew
    //
    // MINOR:
    // Load properties present in both schema and document.  Sanitize
    // removed properties before loading
    //
    // PATCH:
    // Load entire document as is.

    // For now, we'll just start with a blank attestation if the versions
    // don't match.
    if (schema.id === attestation.get('schemaId')) {
      securityControlGroup.document.load(attestation.get('document'));
    }

    attestation.set('schemaId', schema.id);

    this.setProperties({ attestation, progressPercent: '100', loading: false,
                         document: securityControlGroup.document });
  },

  onSuccessfulSave() {
    this.set('saveMessage', 'Saved successfully!');

    Ember.run.later(this, () => {
      this.setProperties({ showSave: false, saveMessage: null });
    }, 1500);
  },

  onFailedSave(response) {
    this.set('error', response.errors.message);
  },

  actions: {
    save() {
      this.set('error', null);

      let { attestation, document } = this.getProperties('attestation', 'document');
      let documentClone = Ember.$.extend(true, {}, document.dump({ excludeInvalid: true }));

      attestation.set('document', documentClone);
      attestation.save().then(() => this.onSuccessfulSave())
                        .catch((response) => this.onFailedSave(response));
    },

    onChange() {
      let lastAttestationDocument = JSON.stringify(this.get('attestation.document'));
      let currentDocument = JSON.stringify(this.get('document').dump());

      if(lastAttestationDocument !== currentDocument) {
        this.set('showSave', true);
      }
    }
  }
});
