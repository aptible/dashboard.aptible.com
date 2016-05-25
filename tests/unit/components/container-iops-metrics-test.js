import Ember from 'ember';
import resolver from '../../helpers/resolver';
import {
  moduleForComponent,
  test
} from 'ember-qunit';

let dummyMetricsData = {
  columns: [
    [ "time_0", "2016-05-25T15:01:00Z", ],
    [ "a", 1, 40, 3, 100 ]
  ],
  xs: { "a": "time_0" }
};

moduleForComponent('container-iops-metrics', 'ContainerIopsMetricsComponent', {
  unit: true,
  needs: ['component:more-info-icon', 'component:bs-alert'],

  beforeEach() {
    this.container.register('component:c3-chart', Ember.Component.extend());
    this.container.register('template:mixins/container-metrics', resolver.resolve('template:mixins/-container-metrics'));

    this.container.register('service:metrics-api', Ember.Service.extend({
      fetchMetrics(containers) {
        return new Ember.RSVP.Promise((resolve) => {
          resolve(containers.length === 0 ? {} : dummyMetricsData);
        });
      }
    }));
  }
});

test('axisMax defaults to baselineIops', function(assert) {
  assert.expect(1);

  let component = this.subject({
    baselineIops: 10,
    containers: []
  });

  component.get("axisMax").then((axisMax) => { 
    assert.equal(axisMax, 11);
  });
});


test('axisMax accounts for containers', function(assert) {
  assert.expect(1);

  let component = this.subject({
    baselineIops: 10,
    containers: [Ember.Object.create({id: 1})]
  });

  component.get("axisMax").then((axisMax) => {
    assert.equal(axisMax, 110);
  });
});
