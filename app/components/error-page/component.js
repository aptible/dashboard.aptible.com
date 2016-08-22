import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "div",
  classNames: ["error-page"],

  errorCode: null,
  title: "An error occurred",
  message: "That's all we know",

  actionName: "Back to Home",
  actionDestination: "index"
});
