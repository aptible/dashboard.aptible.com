import Ember from 'ember';

const VHOST_TYPE_GENERIC = 'generic';
const VHOST_TYPE_DEFAULT = 'default';
const VHOST_TYPE_ACME = 'acme';

const VHOST_RESET_PROPERTIES = {};

VHOST_RESET_PROPERTIES[VHOST_TYPE_GENERIC] = {
  "isDefault": false,
  "isAcme": false,
  "userDomain": null,
  "useCertificate": true
};

VHOST_RESET_PROPERTIES[VHOST_TYPE_DEFAULT] = {
  "isDefault": true,
  "isAcme": false,
  "userDomain": null,
  "useCertificate": false
};

VHOST_RESET_PROPERTIES[VHOST_TYPE_ACME] = {
  "isDefault": false,
  "isAcme": true,
  "internal": false,
  "useCertificate": false
};

export default Ember.Component.extend({
  model: null,
  services: null,
  vhosts: null,
  certificates: null,

  vhostType: null,
  vhostService: null,
  userDomainValid: false,

  TYPE_GENERIC: VHOST_TYPE_GENERIC,
  TYPE_DEFAULT: VHOST_TYPE_DEFAULT,
  TYPE_ACME: VHOST_TYPE_ACME,

  vhostTypeObserver: function() {
    const vhost = this.get("model");
    const vhostType = this.get("vhostType") ;
    const resets = VHOST_RESET_PROPERTIES[vhostType] || {};

    for (let k in resets) {
      if (!resets.hasOwnProperty(k)) {
        continue;
      }
      vhost.set(k, resets[k]);
    }
  }.observes("vhostType"),

  didInitAttrs() {
    // Any service is fine as a default.
    let defaultService = this.get("services").objectAt(0);
    this.set('vhostService', defaultService);

    // Prefer VHOSTs types that require the least configuration from the user.
    let defaultVhostType = VHOST_TYPE_GENERIC;
    if (this.get("acmeVhostAllowed")) { defaultVhostType = VHOST_TYPE_ACME; }
    if (this.get("defaultVhostAllowed")) { defaultVhostType = VHOST_TYPE_DEFAULT; }
    this.set('vhostType', defaultVhostType);

    // The observer won't run automatically, so we force it now.
    this.vhostTypeObserver();
  },

  isGeneric: Ember.computed.equal("vhostType", VHOST_TYPE_GENERIC),
  isDefault: Ember.computed.equal("vhostType", VHOST_TYPE_DEFAULT),
  isAcme: Ember.computed.equal("vhostType", VHOST_TYPE_ACME),

  placementNeeded: Ember.computed.not("isAcme"),
  userDomainNeeded: Ember.computed.and("isAcme"),

  defaultVhostAllowed: Ember.computed("vhosts.[]", function() {
    return !(this.get("vhosts").any((vhost) => {
      return vhost.get("isDefault");
    }));
  }),

  acmeVhostAllowed: Ember.computed.equal('vhostService.stack.sweetnessStackVersion', 'v2'),

  formValid: Ember.computed("vhostType", "userDomainValid", function() {
    if (this.get("isAcme")) {
      return this.get("userDomainValid");
    }
    return true;
  }),

  formInvalid: Ember.computed.not("formValid"),

  formDisabled: Ember.computed.or("formInvalid", "model.isSaving"),

  actions: {
    save(vhost, service) {
      this.sendAction('save', vhost, service);
    },

    cancel() {
      this.sendAction('cancel');
    },

    willTransition() {
      this.sendAction('willTransition');
    }
  }
});
