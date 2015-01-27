import Ember from "ember";

export default Ember.Controller.extend({
  months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
  years: ['2015', '2016', '2017', '2018', '2019', '2020'],
  plans: ['development', 'pilot', 'platform', 'production']
});
