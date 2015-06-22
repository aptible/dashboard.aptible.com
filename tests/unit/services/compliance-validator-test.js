import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('service:compliance-validator', 'ComplianceValidatorService', {

});

function compliantStatus() {
  return { green: true };
}

function nonCompliantStatus() {
  return { green: false };
}

test('#areAllCriteriaCompliant: returns true when all criteria are compliant', function() {
  expect(1);
  var service = this.subject();

  let criteria = [{ getSubjectStatus: compliantStatus },
                  { getSubjectStatus: compliantStatus }];

  ok(service.areAllCriteriaCompliant(criteria, {}, {}, 'all criteria are compliant'));
});

test('#areAllCriteriaCompliant: returns false when one criterion is not compliant', function() {
  expect(1);
  var service = this.subject();

  let criteria = [{ getSubjectStatus: compliantStatus },
                  { getSubjectStatus: nonCompliantStatus }];

  ok(!service.areAllCriteriaCompliant(criteria, {}, {}, 'all criteria are compliant'));
});
