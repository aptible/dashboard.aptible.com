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

  // Prefix subdomain suffix with '-', if it is present
  var subdomainSuffix = process.env['SUBDOMAIN_SUFFIX'];

  // Metrics is handled completely differently (it's a single domain with different paths).
  if(subdomain === "metrics") {
    var metricsBaseUrl = 'https://ewno8ssw8g.execute-api.us-east-1.amazonaws.com/';
    return metricsBaseUrl + subdomainSuffix + environment +'/proxy';
  };

  if (subdomainSuffix) {
    subdomainSuffix = '-' + subdomainSuffix;
  }

  return protocol + subdomain + subdomainSuffix + '.' + domain;
}
