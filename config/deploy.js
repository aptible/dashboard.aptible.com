module.exports = {
  production: {
    store: {
    },

    assets: {
      type: 's3',
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
      acl: 'public-read',
      bucket: 'dashboard.aptible.com'
    }
  },

  staging: {
    store: {
    },

    assets: {
      type: 's3',
      accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
      secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
      acl: 'public-read',
      bucket: 'dashboard.aptible-staging.com'
    }
  }
};
