import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("apps", {}, function() {
    this.route("show", {
      path: "/:app_id"
    }, function() {
      this.route("operations");
    });
  });

  this.route("service", {
    path: "services/:service_id"
  }, function() {
    this.route("new-vhost", {
      path: "vhosts/new"
    });
  });

  this.route("databases", {}, function() {
    this.route("show", {
      path: "/:database_id"
    }, function() {
      this.route("operations");
    });
  });

  this.route("login");
  this.route("logout");

  this.route("stack", {
    path: "stacks/:stack_id"
  }, function() {
    this.route("new-database", {
      path: "databases/new"
    });

    this.route("new-app", {
      path: "apps/new"
    });

    this.route("settings");
  });

  this.route("signup");

  this.route("verify", {
    path: "verify/:verification_code"
  });

  this.route("welcome", function() {
    this.route("first-app");
    this.route("payment-info");
  });
});

export default Router;