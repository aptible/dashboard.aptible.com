import Ember from 'ember';
import startApp from '../helpers/start-app';
import { stubRequest } from '../helpers/fake-server';

var App;

module('Acceptance: Service New Vhost', {
  setup: function() {
    App = startApp();
    stubStacks();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visit /services/:id/vhosts/new', function(){
  var serviceId = 'service-1';

  stubRequest('get', '/services/' + serviceId, function(request){
    return this.success({
      id: serviceId,
      handle: 'the-service'
    });
  });

  signInAndVisit('/services/' + serviceId + '/vhosts/new');

  andThen(function(){
    var header = find('h4:contains(Add a Virtual Host)');
    ok(header.length, 'has header');

    var serviceHandle = find(':contains(the-service)');
    ok(serviceHandle.length, 'shows service name');

    var virtualDomainInput = find('input.virtual-domain');
    ok(virtualDomainInput.length, 'has virtual domain input');

    var certificateInput = find('textarea.certificate');
    ok(certificateInput.length, 'has certificate input');

    var keyInput = find('textarea.private-key');
    ok(keyInput.length, 'has private-key input');

    var okButton = find('button:contains(Add virtual host)');
    ok(okButton.length, 'has ok button');

    var cancelButton = find('button:contains(Add virtual host)');
    ok(cancelButton.length, 'has cancel button');
  });
});

test('visit /services/:id/vhosts/new and create vhost', function(){
  expect(4);

  var serviceId = 'service-1';

  stubRequest('get', '/services/' + serviceId, function(request){
    return this.success({
      id: serviceId,
      handle: 'the-service'
    });
  });

  stubRequest('post', '/services/' + serviceId + '/vhosts', function(request){
    var json = this.json(request);
    equal(json.virtual_domain, 'my.domain.com');
    equal(json.certificate, 'my long cert');
    equal(json.private_key, 'my long pk');
    equal(json.type, 'http');

    return this.success({
      id: 'new-vhost-id',
    });
  });

  signInAndVisit('/services/' + serviceId + '/vhosts/new');
  fillIn('input.virtual-domain', 'my.domain.com');
  fillIn('textarea.certificate', 'my long cert');
  fillIn('textarea.private-key', 'my long pk');
  click('button:contains(Add virtual host)');
});
