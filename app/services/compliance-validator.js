import Ember from 'ember';

export default Ember.Service.extend({
  areAllCriteriaCompliant(criteria, subject, organization) {
    let compliant = true;

    criteria.forEach((criterion) => {
      if(!criterion.getSubjectStatus(subject, organization).green) {
        compliant = false;
      }
    });

    return compliant;
  }
});
