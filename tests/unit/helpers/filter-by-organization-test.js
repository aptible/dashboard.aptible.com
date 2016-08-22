import {
  filterByOrganization
} from '../../../helpers/filter-by-organization';
import { module, test } from 'qunit';
import Ember from "ember";

module('FilterByOrganizationHelper');

test('it works', function(assert) {
  const organizationUrl = '/some-url';
  const organization = Ember.Object.create({
    data: { links: { self: organizationUrl } }
  });
  const items = Ember.A([
    { data: { links: { organization: organizationUrl } } },
    { data: { links: { organization: 'some-other-url' } } },
    { data: { links: { organization: organizationUrl } } }
  ]);
  var result = filterByOrganization([items, organization]);
  assert.ok(Ember.get(result, 'length'), 2);
});
