/* jshint node: true */
'use strict';

module.exports = {
  name: 'dns-prefetch',
  contentFor: function(type, config) {
    if (type !== 'head' || !Array.isArray(config.prefetch)) {
      return '';
    }
    var indent = "    ";
    var tags = config.prefetch.map(function(host) {
      return indent + '<link rel="dns-prefetch" href="//' + host + '">';
    });

    tags.unshift(indent + '<meta http-equiv="x-dns-prefetch-control" content="on">');
    return tags.join('\n');
  }
};