module.exports = function(subdomain, environment, protocol) {
  var explicitEndpoint = process.env[subdomain.toUpperCase() + '_BASE_URI'];
  if (explicitEndpoint) {
    return explicitEndpoint;
  }

  var domain = process.env['DOMAIN'];
  if (!domain) {
    // Set domain based on environment
    switch(environment) {
      case 'sandbox':
        domain = 'aptible-sandbox.com';
        break;
      case 'staging':
        domain = 'aptible-staging.com';
        break;
      case 'production':
        domain = 'aptible-foobar.com';
        break;
      default:
        return null;
    }
  }

  if (protocol === undefined) {
    protocol = 'https://';
  }

  var subdomainSuffix = process.env['SUBDOMAIN_SUFFIX'] || '';
  return protocol + subdomain + subdomainSuffix + '.' + domain;
}
