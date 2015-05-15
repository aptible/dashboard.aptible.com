import Base from 'ember-validations/validators/base';

const COMPLEXITY_RULES = [
  ['must be at least 10 characters', /^.{0,9}$/],
  ['must no greater than 128 characters', /^.{129,}$/],
  ['must contain at least one uppercase letter', /^[^A-Z]+$/],
  ['must contain at least one lowercase letter', /^[^a-z]+$/],
  ['must contain at least one digit or special character', /^[^0-9!@#$%^&*()]+$/]
];

export default Base.extend({
  call: function(){
    let possiblePassword = this.model.get(this.property);
    if (!possiblePassword) {
      return;
    }
    for (let i=0, l=COMPLEXITY_RULES.length;i<l;i++) {
      let message = COMPLEXITY_RULES[i][0];
      let ruleRegex = COMPLEXITY_RULES[i][1];
      if (ruleRegex.exec(possiblePassword)) {
        this.errors.pushObject(message);
      }
    }
  }
});
