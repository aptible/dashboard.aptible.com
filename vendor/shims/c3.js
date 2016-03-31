(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['c3'] };
  }

  define('c3', [], vendorModule);
})();
