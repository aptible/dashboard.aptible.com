import Base from 'ember-validations/validators/base';

export const VALID_EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export default Base.extend({
  call: function(){
    var possibleEmail = this.model.get(this.property);
    if (!VALID_EMAIL_REGEX.exec(possibleEmail)) {
      this.errors.pushObject("is not valid.");
    }
  }
});