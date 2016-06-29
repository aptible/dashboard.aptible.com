import Ember from "ember";

// Intentionally permissive. We don't care about validation as much as
// preventing obvious mistakes.
export const BASIC_DOMAIN_REGEXP = /^[a-z0-9\-.]+\.[a-z]+$/i;

export default Ember.Component.extend({
  domain: null,
  valid: null,
  tip: null,

  domainValid: Ember.computed("domain", function() {
    return BASIC_DOMAIN_REGEXP.test(this.get("domain"));
  }),

  errorClass: Ember.computed("domainValid", function() {
    if (this.get("domainValid")) {
      return "";
    }
    return "has-error";
  }),

  domainValidObserver: function() {
    this.set("valid", this.get("domainValid"));
  }.observes("domainValid")
});
