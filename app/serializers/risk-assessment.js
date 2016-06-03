import ApplicationSerializer from './application';

export const RISK_ASSESSMENT_COMPONENTS = ['mitigations', 'threat_sources',
                                          'security_controls', 'vulnerabilities',
                                          'predisposing_conditions', 'threat_events'];

// This serializer does 2 important things to make Ember Data relationships work
// with risk assessment components.  Components will always be embedded--there
// should never be an AJAX request to load any component of a risk assessment.

// Job 1:
// The Risk Assessment's ID is used to prefix all model component's own IDs.
// This prevents risk assessment components from colliding with components
// of other risk assessments once loaded into the Ember Data store.  Without
// the prefix, we could possibly load common component IDs multiple times:
// e.g. `craft_spear_phishing` likely exists as a threat event in multiple
// risk assessments--these threat events would become one if we didn't otherwise
// differentiate their IDs.

// Job 2:
// All components are updated to included updated references to related
// components.  This includes:
//  * Adding the `risk_assessment_id` field to all components
//  * Flattening mitigations and instead adding the relationships between
//  vulnerabilities and security controls to fields directly on those components
//  * Updating all relationship keys to include the risk assessment id as a prefix

export default ApplicationSerializer.extend({
  extractArray(store, primaryType, rawPayload) {
    rawPayload._embedded.risk_assessments.map((riskAssessment) => {
      return this._extractRiskAssessment(riskAssessment);
    });

    return this._super(store, primaryType, rawPayload);
  },

  extractSingle(store, primaryType, rawPayload, recordId) {
    rawPayload = _extractRiskAssessment(rawPayload);
    return this._super(store, primaryType, rawPayload, recordId);
  },

  _extractRiskAssessment(riskAssessment) {
    riskAssessment = this._addRiskAssesmentIdToEmbeddeds(riskAssessment);
    riskAssessment = this._updateRelationshipKeysWithPrefix(riskAssessment);
    riskAssessment = this._flattenMitigations(riskAssessment);

    return riskAssessment;
  },

  _addRiskAssesmentIdToEmbeddeds(riskAssessment) {
  // Step 1:
    // For each resource, add a reference to `risk_assessment_id` and update
    // the resources ID to be prefixed with the risk assessment ID.
    RISK_ASSESSMENT_COMPONENTS.forEach((type) => {
      riskAssessment._embedded[type].map((typeInstance) => {
        typeInstance.risk_assessment_id = riskAssessment.id;
        typeInstance.id = `${riskAssessment.id}_${typeInstance.id}`;
        return typeInstance;
      });
    });

    return riskAssessment;
  },

  _updateRelationshipKeysWithPrefix(riskAssessment) {
    // Step 2:
    // For each threat event, updated hasMany keys to include the risk assessment
    // ID as a prefix for each key.
    riskAssessment._embedded.threat_events.map((threatEvent) => {
      ['vulnerabilities', 'threat_sources', 'predisposing_conditions'].forEach((relationship) => {
        threatEvent[relationship] = threatEvent[relationship].map((key) => {
          return `${riskAssessment.id}_${key}`
        });
      })
      return threatEvent;
    });

    // Update vulnerability and security control keys on mitigations
    riskAssessment._embedded.mitigations.map((mitigation) => {
      mitigation.vulnerability = `${riskAssessment.id}_${mitigation.vulnerability}`;
      mitigation.security_control = `${riskAssessment.id}_${mitigation.security_control}`;
      return mitigation;
    });

    return riskAssessment;
  },

  _flattenMitigations(riskAssessment) {
    // Step 3:
    // Security controls and vulnerabilitis are many-to-many through mitigations
    // loop over mitigations and set references to relationships directly on
    // each vuln and sc.
    riskAssessment._embedded.mitigations.forEach((mitigation) => {
      let vulnerability = riskAssessment._embedded.vulnerabilities.findBy('id', mitigation.vulnerability);
      let sc = riskAssessment._embedded.security_controls.findBy('id', mitigation.security_control);

      if(vulnerability) {
        vulnerability.security_controls = vulnerability.security_controls || [];
        vulnerability.security_controls.push(mitigation.security_control);
      }

      if(sc) {
        sc.vulnerabilities = sc.vulnerabilities || [];
        sc.vulnerabilities.push(mitigation.vulnerability);
      }
    });

    return riskAssessment;
  }
});