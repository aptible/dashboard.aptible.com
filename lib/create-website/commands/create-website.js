var fs = require('fs');
var path = require('path');
var Promise = require('ember-cli/lib/ext/promise');

module.exports = {
  name: 'create-website',
  description: 'Creates a website using S3, CloudFront, and Route53.',
  works: 'insideProject',

  availableOptions: [
    { name: 'domain', type: String },
    { name: 'subdomain-suffix', type: String, default: '' },
    { name: 'cloudfront', type: Boolean, default: true },
    { name: 'region', type: String, default: 'us-east-1' }
  ],

  templateBody: function(useCloudFront) {
    var templateBasePath = path.join(__dirname, '..', 'templates');
    var templateFileName = useCloudFront ? 'cloudfront-s3-website.json' : 's3-website.json';

    return fs.readFileSync(
      path.join(templateBasePath, templateFileName),
      { encoding: 'utf8'}
    );
  },

  buildParams: function(commandOptions) {
    // Prefix subdomainSuffix with '-', if it is present
    var subdomainSuffix = '';
    if (commandOptions.subdomainSuffix) {
      var subdomainSuffix = '-' + commandOptions.subdomainSuffix;
    }
    var stackName = 'website-dashboard' + subdomainSuffix + '.' + commandOptions.domain;
    // stack name can only be alpha, numeric, and dashes
    stackName = stackName.replace(/[^a-zA-Z0-9]/g, '-');

    var templateBody = this.templateBody(commandOptions.cloudfront);

    return {
      StackName: stackName,
      OnFailure: 'ROLLBACK',
      Parameters: [
        {
          ParameterKey: 'Domain',
          ParameterValue: commandOptions.domain
        },
        {
          ParameterKey: 'Subdomain',
          ParameterValue: 'dashboard' + subdomainSuffix
        }
      ],
      TemplateBody: templateBody
    };
  },

  run: function(commandOptions, rawArgs) {
    var AWS = require('aws-sdk');
    var params = this.buildParams(commandOptions);
    var ui = this.ui;

    var cloudFormation = new AWS.CloudFormation({
      region: commandOptions.region,
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY']
    });

    return new Promise(function(resolve, reject) {
      ui.writeLine('Creating ' + params.StackName);
      cloudFormation.createStack(params, function(err, data) {
        if (err) {
          ui.writeLine(params.StackName + ' errored');
          ui.writeError(err);

          reject(err);
        } else {
          ui.writeLine(params.StackName + ' initializing');
          resolve(data);
        }
      });
    });
  }
};
