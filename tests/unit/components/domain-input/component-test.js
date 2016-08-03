import {
  moduleForComponent,
  test
} from "ember-qunit";
import { BASIC_DOMAIN_REGEXP } from "diesel/components/domain-input/component";
import hbs from "htmlbars-inline-precompile";


moduleForComponent("domain-input", {
  integration: true
});


test("invalid domain is invalid", function(assert) {
  assert.expect(3);

  this.render(hbs`{{domain-input domain=domainValue valid=validValue}}`);

  const input = this.$("input");
  input.val("some val");
  input.trigger("input");

  assert.equal(this.get("domainValue"), "some val");
  assert.equal(this.get("validValue"), false);
  assert.ok(this.$("div.form-group.has-error").length);
});

test("valid domain is valid", function(assert) {
  assert.expect(3);

  this.render(hbs`{{domain-input domain=domainValue valid=validValue}}`);

  const input = this.$("input");
  input.val("domain.com");
  input.trigger("input");

  assert.equal(this.get("domainValue"), "domain.com");
  assert.equal(this.get("validValue"), true);
  assert.ok(!this.$("div.form-group.has-error").length);
});

test("tip is shown", function(assert) {
  assert.expect(1);
  this.render(hbs`{{domain-input domain=domainValue valid=validValue tip="hello tip"}}`);
  assert.ok(this.$("p:contains(hello tip)").length);
});

[
  "http://test.com", "some", "1.1", "foo.bar.3", "!://abc.com", "❤️.com",
  "foo bar"
].forEach((domain) => {
  test(`it does not accept ${domain}`, function(assert) {
    assert.ok(!BASIC_DOMAIN_REGEXP.test(domain));
  });
});


[
  "test.com", "abc.com", "some.foo", "11.bar", "foo.bar", "SOME.Foo",
  "ab.cd.ef", "te-st.com", "xn--qei.com", "test.unreasonabletld"
].forEach((domain) => {
  test(`it accepts ${domain}`, function(assert) {
    assert.ok(BASIC_DOMAIN_REGEXP.test(domain));
  });
});
