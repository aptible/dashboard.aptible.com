import Ember from 'ember';

export default function buildURLWithPrefixMap(prefixPropertyMapping){
  return function buildURL(type, id, record) {
    var url = [],
        host = Ember.get(this, 'host'),
        prefix = this.urlPrefix();

    if (type) {

      // loop through prefix map {prefixName -> propName}
      // If any property exists on the record, prepend both the prefix name
      // and the property value.
      Ember.keys(prefixPropertyMapping).forEach(function(prefixName){
        var prefixPropName = prefixPropertyMapping[prefixName];

        var prefixProp = record ? Ember.get(record, prefixPropName) : null;

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
