module.exports = {
  production: {
    buildEnv: 'production',

    store: {
      type: 's3-static',
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
      acl: 'public-read',
      bucket: 'sheriff.aptible.com'
    },

    assets: {
      type: 's3',
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
      acl: 'public-read',
      bucket: 'sheriff.aptible.com'
    }
  },

  staging: {
    buildEnv: 'staging',

    store: {
      type: 's3-static',
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
      acl: 'public-read',
      bucket: 'sheriff.aptible-staging.com'
    },

    assets: {
      type: 's3',
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
      acl: 'public-read',
      bucket: 'sheriff.aptible-staging.com'
    }
  }
};
