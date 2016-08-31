import Ember from 'ember';
import { stubRequest } from 'ember-cli-fake-server';

export var orgId = '1';
export var rolesHref = `/organizations/${orgId}/roles`;
export var usersHref = `/organizations/${orgId}/users`;
export var billingDetailHref = `/billing_details/${orgId}`;
export var invitationsHref = `/organizations/${orgId}/invitations`;
export var securityOfficerId = 'security-officer-3';
export var securityOfficerHref = `/users/${securityOfficerId}`;
export var trainingCriterionId = 'training-criterion-1';
export var developerCriterionId = 'developer-criterion-2';
export var securityCriterionId = 'training-criterion-3';
export var riskCriterionId = 'risk-criterion-4';
export var policyCriterionId = 'policy-criterion-5';
export var appSecCriterionId = 'app-security-criterion-6';
export var criteria = [
  {
    id: trainingCriterionId,
    scope: 'user',
    name: 'Training Log',
    handle: 'training_log',
    _links: {
      documents: { href: `/criteria/${trainingCriterionId}/documents` }
    }
  },
  {
    id: developerCriterionId,
    scope: 'user',
    name: 'Developer Training Log',
    handle: 'developer_training_log',
    _links: {
      documents: { href: `/criteria/${developerCriterionId}/documents` }
    }
  },
  {
    id: securityCriterionId,
    scope: 'user',
    name: 'Security Officer Training Log',
    handle: 'security_officer_training_log',
    _links: {
      documents: { href: `/criteria/${securityCriterionId}/documents` }
    }
  },
  {
    id: riskCriterionId,
    scope: 'user',
    name: 'Risk Assessment',
    handle: 'risk_assessment',
    _links: {
      documents: { href: `/criteria/${riskCriterionId}/documents` }
    }
  },
  {
    id: policyCriterionId,
    scope: 'user',
    name: 'Policy Manual',
    handle: 'policy_manual',
    _links: {
      documents: { href: `/criteria/${policyCriterionId}/documents` }
    }
  },
  {
    id: appSecCriterionId,
    scope: 'user',
    name: 'Application Security Interview',
    handle: 'app_security_interview',
    _links: {
      documents: { href: `/criteria/${appSecCriterionId}/documents` }
    }
  },
];

Ember.Test.registerHelper('stubValidOrganization', function(app, orgData, billingDetailData) {
  if (orgData && orgData.orgId) {
    orgId = orgData.ordId;
  }
  let organization = Ember.$.extend({
    id: orgId,
    name: orgId,
    _links: {
      roles: { href: rolesHref },
      users: { href: usersHref },
      billing_detail: { href: billingDetailHref },
      invitations: { href: invitationsHref },
      security_officer: { href: `/users/${securityOfficerId}` },
      self: { href: `/organizations/${orgId}` }
    }
  }, orgData);

  let billingDetail = Ember.$.extend({
    id: orgId,
    plan: 'pilot',
    _links: {
      organization: { href: `/organizations/${orgId}` }
    }
  }, billingDetailData);

  stubRequest('get', `/organizations/${orgId}`, function() {
    return this.success(organization);
  });

  stubRequest('get', '/organizations', function() {
    return this.success({ _embedded: { organizations: [organization] }});
  });

  stubRequest('get', `/billing_details/${orgId}`, function() {
    return this.success(billingDetail);
  });
});

Ember.Test.registerHelper('stubProfile', function(_app, profileData) {
  stubRequest('get', `/organization_profiles/${orgId}`, function() {
    let defaultProfileData = {
      id: orgId,
      hasCompletedSetup: true,
      _links: {
        risk_assessments: { href: `/organization_profiles/${orgId}/risk-assessments` },
        self: { href: `/organization_profiles/${orgId}` }
      }
    };

    return this.success(Ember.$.extend({}, defaultProfileData, profileData));
  });
});

Ember.Test.registerHelper('clickContinueButton', function() {
  let continueButton = findWithAssert('button.spd-nav-continue').first();
  continueButton.click();
});


Ember.Test.registerHelper('clickBackButton', function() {
  let continueButton = findWithAssert('button.spd-nav-back').first();
  continueButton.click();
});

Ember.Test.registerHelper('stubCurrentAttestations', function(_app, attestationPayloads) {
  var attestationId = 0;

  stubRequest('get', `/organization_profiles/${orgId}/attestations`, function(request) {
    let requestHandle = request.url.replace(/.+handle=(\S+)/, '$1');
    let attestations = [];

    if (requestHandle && attestationPayloads[requestHandle]) {
      attestations = [{
        id: attestationId++,
        schema_id: `${requestHandle}/1`,
        handle: requestHandle,
        document: attestationPayloads[requestHandle] || {},
        _links: {
          self: { href: `/attestations/${attestationId}` },
          organization_profile: { href: `/organization_profiles/${orgId}` }
        }
      }];
    }

    return this.success({ _embedded: { attestations } });
  });
});

Ember.Test.registerHelper('stubCriteria', function(app, customCriteria) {
  if(customCriteria) { criteria = customCriteria; }

  stubRequest('get', '/criteria', function() {
    return this.success({ _embedded: { criteria }});
  });

  criteria.forEach((criterion) => {
    stubRequest('get', `/criteria/${criterion.id}`, function() {
      return this.success(criterion);
    });
  });
});

Ember.Test.registerHelper('stubCriterionDocuments', function(app, criteriaDocuments) {
  stubRequest('get', `/criteria/${policyCriterionId}/documents`, function() {
    return this.success({ _embedded: { documents: criteriaDocuments[policyCriterionId] || [] } });
  });

  stubRequest('get', `/criteria/${riskCriterionId}/documents`, function() {
    return this.success({ _embedded: { documents: criteriaDocuments[riskCriterionId] || [] } });
  });

  stubRequest('get', `/criteria/${appSecCriterionId}/documents`, function() {
    return this.success({ _embedded: { documents: criteriaDocuments[appSecCriterionId] || [] } });
  });

  stubRequest('get', `/criteria/${trainingCriterionId}/documents`, function() {
    return this.success({ _embedded: { documents: criteriaDocuments[trainingCriterionId] || [] } });
  });

  stubRequest('get', `/criteria/${securityCriterionId}/documents`, function() {
    return this.success({ _embedded: { documents: criteriaDocuments[securityCriterionId] || [] } });
  });

  stubRequest('get', `/criteria/${securityOfficerId}/documents`, function() {
    return this.success({ _embedded: { documents: criteriaDocuments[securityOfficerId] || [] } });
  });
});