import Ember from 'ember';

export default Ember.Route.extend({
  titleToken: function(tokens){
    return 'Risk Assessment';
    tokens.push('Risk Assessment');
    return tokens.join(' - ');
  }
});
