import Ember from 'ember';

const VHOST_TYPE_GENERIC = 'generic';
const VHOST_TYPE_DEFAULT = 'default';
const VHOST_TYPE_ACME = 'acme';

const VHOST_RESET_PROPERTIES = {};

VHOST_RESET_PROPERTIES[VHOST_TYPE_GENERIC] = {
  "isDefault": false,
  "acmeDomain": null
};

VHOST_RESET_PROPERTIES[VHOST_TYPE_DEFAULT] = {
  "isDefault": true,
  "acmeDomain": null
};

VHOST_RESET_PROPERTIES[VHOST_TYPE_ACME] = {
  "isDefault": false,
  "internal": false
};

export default Ember.Component.extend({
  model: null,
  services: null,
  vhosts: null,
  certificates: null,

  vhostType: null,
  vhostService: null,
  acmeDomainValid: false,

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
  }.observes('vhostType'),

  didInitAttrs() {
    // Set up some defaults when this component is instantiated.
    this.set('vhostType', this.get("defaultVhostAllowed") ? VHOST_TYPE_DEFAULT: VHOST_TYPE_ACME);
    this.set('vhostService', this.get("services").objectAt(0));
    this.vhostTypeObserver();
  },

  isGeneric: Ember.computed.equal("vhostType", VHOST_TYPE_GENERIC),
  isDefault: Ember.computed.equal("vhostType", VHOST_TYPE_DEFAULT),
  isAcme: Ember.computed.equal("vhostType", VHOST_TYPE_ACME),

  placementNeeded: Ember.computed.not("isAcme"),
  acmeDomainNeeded: Ember.computed.and("isAcme"),
  certificateNeeded: Ember.computed.and("isGeneric"),
  defaultVhostAllowed: Ember.computed("vhosts.[]", function() {
    return !(this.get("vhosts").any((vhost) => {
      return vhost.get("isDefault");
    }));
  }),

  formValid: Ember.computed("vhostType", "acmeDomainValid", function() {
    if (this.get("isAcme")) {
      return this.get("acmeDomainValid");
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
