var execSync = require('child_process').execSync;

module.exports = {
  // Push master (including version bump) to `release` branch.
  afterPush: function() {
    console.log('pushing master to release branch');
    var output = execSync('git push origin master:release', { encoding: 'utf8' });
    console.log(output);
  }
};
