import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("app", {
    path: "apps/:app_id"
  }, function() {
    this.route("services");
    this.route("vhosts", {}, function(){
      this.route('new');
      this.route('edit', {
        path: ':vhost_id/edit'
      });
    });
    this.route("activity");
    this.route("deprovision");
    this.route("deploy");
  });

  this.route("database", {
    path: "databases/:database_id"
  }, function() {
    this.route("activity");
    this.route("deprovision");
  });


  this.route("stack", { path: "stacks/:stack_id" }, function() {
    this.route("log-drains", {
      path: 'logging'
    }, function(){
      this.route("new");
    });

    this.route("apps", {
      resetNamespace: true
    }, function() {
      this.route("new");
    });

    this.route("databases", {
      resetNamespace: true
    }, function() {
      this.route("new");
    });
  });

  this.route("stacks");
  this.route("login");
  this.route("logout");
  this.route("signup");
  this.route("password", {}, function(){
    this.route('reset');
    this.route('new', {path: 'new/:reset_code/:user_id'});
  });

  this.route('settings', {}, function(){
    this.route('admin');
    this.route('profile');
    this.route('ssh');
  });

  this.route("verify", {
    path: "verify/:verification_code"
  });

  this.route("claim", {
    path: "claim/:invitation_id/:verification_code"
  });

  this.route("welcome", function() {
    this.route("first-app");
    this.route("payment-info");
  });

  this.route("organization", {path: "/organizations/:organization_id"}, function() {
    this.route("members");
    this.route("invitations");
    this.route("roles");
  });
});

export default Router;
