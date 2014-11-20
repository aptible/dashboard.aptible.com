import Ember from 'ember';

export default function(prefixProperty, prefixName){
  return function buildURL(type, id, record) {
    var url = [],
        host = Ember.get(this, 'host'),
        prefix = this.urlPrefix();

    if (type) {

      var prefixProp = record ? Ember.get(record, prefixProperty) : null;
      if (prefixProp) {

        // add /prefixName/prefixProp to url

        url.push( prefixName );
        url.push( prefixProp );
      }

      url.push(this.pathForType(type));
    }

    if (id && !Ember.isArray(id)) { url.push(encodeURIComponent(id)); }

    if (prefix) { url.unshift(prefix); }

    url = url.join('/');
    if (!host && url) { url = '/' + url; }

    return url;
  };
}
