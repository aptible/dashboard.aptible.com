module.exports = {
  name: 'create-website',

  isDevelopingAddon: function() {
    return true;
  },

  includedCommands: function() {
    return {
      'create-website' : require('./commands/create-website')
    };
  }
};
