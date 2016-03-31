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
        domain = 'aptible.com';
        break;
      default:
        return null;
    }
  }

  if (protocol === undefined) {
    protocol = 'https://';
  }

  var subdomainSuffix = process.env['SUBDOMAIN_SUFFIX'] || '';
  var path = '';

  // Metrics does not support subdomain suffixes, so sandbox uses
  // paths instead.
  if(subdomain === 'metrics' && domain === "aptible-sandbox.com") {
    path = "/" + subdomainSuffix + "sandbox";
    subdomainSuffix = '';
  }

  // Prefix subdomain suffix with '-', if it is present
  if (subdomainSuffix) {
    subdomainSuffix = '-' + subdomainSuffix;
  }

  return protocol + subdomain + subdomainSuffix + '.' + domain + path;
};
