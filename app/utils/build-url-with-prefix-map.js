import Ember from 'ember';

// Iterates through the items in the `prefixMapping` object and calls
// the callback for each prefixMapping that applies to this requestType.
// `requestType` is passed as the 4th argument to buildURL as of https://github.com/emberjs/data/commit/e8ceeeb4c099ab084a603c2b2564c56197c65fc5
// We use the mixins/adapters/-lookup-methods-with-request-types mixin
// to add this `requestType` parameter until an ember-data version is released
// that has the requestType param.
//
// The callback is called with (prefixName, prefixPropName).
//
// The mapping can be an object with string keys and string values, or object values
// that specify which request types are applicable.
//
// Example:
// {
//   'accounts': {property: 'stack.id', only:['create']}
// }
// This will result in prepending the string "/accounts/${record.get('stack.id')}"
// to create requests.
// `eachApplicablePrefixPropertyMapping` will invoke the callback once with ('accounts', 'stack.id')
// if the requestType matches 'create'.
//
// See the model unit tests for more.

function eachApplicablePrefixPropertyMapping(prefixMapping, requestType, callback){
  Ember.keys(prefixMapping).forEach( (prefixName) => {
    let prefixPropertyMapping = prefixMapping[prefixName];

    let prefixPropName = prefixPropertyMapping.property;
    let conditions     = prefixPropertyMapping.only || [];

    if (checkConditions(requestType, conditions)) {
      callback(prefixName, prefixPropName);
    }
  });
}

function checkConditions(requestType, conditions){
  if (conditions.length === 0) { return true; }

  requestType = requestType.toLowerCase();
  return conditions.any((condition) => requestType.match(condition));
}

/*
 * `prefixPropertyMapping` is an object with a key that is the string value
 * to prepend to the url and an object value that has the property to check for on
 * the record and an optional `only` prop of request types to include
 * {
 *   'accounts': {property: 'stack.id', only:['create']}
 * }
 * Prepends `accounts/${record.get('stack.id')}` when the requestType matches 'create'.
 * Valid values of only are:
 *   * find
 *   * create
 *   * update
 *   * delete
 */
export default function buildURLWithPrefixMap(prefixPropertyMapping){
  // From ember-data's buildURL: https://github.com/emberjs/data/blob/ff35ee78bfac058afb7a715a5dfc5760218cc05c/packages/ember-data/lib/adapters/build-url-mixin.js#L51
  return function buildURL(type, id, snapshot, requestType) {
    let url = [],
        host = Ember.get(this, 'host'),
        prefix = this.urlPrefix();

    if (type) {

      // loop through prefix map {prefixName -> (propName OR propObject)}
      // If the requestType is not applicable (i.e. does not match the `propObject.only` array), skip.
      // else:
      //   If the propName property exists on the snapshot, prepend both the prefix name
      //   and the propName property value.
      eachApplicablePrefixPropertyMapping(prefixPropertyMapping, requestType, (prefixName, prefixPropName) => {
        let record = snapshot && snapshot.record;
        let prefixProp = record ? record.get(prefixPropName) : null;

        if (prefixProp) {
          // add /prefixName/prefixProp to url

          url.push( prefixName );
          url.push( prefixProp );
        }
      });

      url.push(this.pathForType(type));
    }

    if (id && !Ember.isArray(id)) { url.push(encodeURIComponent(id)); }

    if (prefix) { url.unshift(prefix); }

    url = url.join('/');
    if (!host && url) { url = '/' + url; }

    return url;
  };
}
