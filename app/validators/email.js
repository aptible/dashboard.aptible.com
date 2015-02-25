import Base from 'ember-validations/validators/base';

let emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export default Base.extend({
  call: function(){
    var possibleEmail = this.model.get(this.property);
    if (!emailRegex.exec(possibleEmail)) {
      this.errors.pushObject("is not valid.");
    }
  }
});
