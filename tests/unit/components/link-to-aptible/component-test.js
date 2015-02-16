import {
  moduleForComponent,
  test
} from 'ember-qunit';
import config from "../../../../config/environment";

moduleForComponent('link-to-aptible', 'LinkToAptibleComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
  teardown: function(){
    delete config.aptibleHosts['test-app'];
  }
});

test('it links to a configured host', function() {
  config.aptibleHosts['test-app'] = 'http://localhost.dev';
  this.subject({ path: 'foo.html', app: 'test-app' });
  var element = this.render();
  var href = element.attr('href');
  equal(href, 'http://localhost.dev/foo.html', 'href combines app and path');
});
