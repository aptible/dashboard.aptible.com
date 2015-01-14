import Ember from "ember";
import config from "./config/environment";

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("organizations", {}, function() {
    this.route("show", {
      path: ":organization_id"
    }, function() {

      this.route("service", {
        path: "services/:service_id"
      }, function() {
        this.route("new-vhost", {
          path: "vhosts/new"
        });
      });

      this.route("app", {
        path: "apps/:app_id",
        resetNamespace: true
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
      });

      this.route("database", {
        path: "databases/:app_id",
        resetNamespace: true
      }, function() {});

      this.route("stacks", {
        resetNamespace: true
      }, function(){
        this.route("stack", {
          path: ":stack_id",
          resetNamespace: true
        }, function() {
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

          this.route("settings");
        });
      });
    });
  });

  this.route("login");
  this.route("logout");
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
