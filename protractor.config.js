exports.config = {

  specs: ['tests/tests/*.js'],

  capabilities: {
    'shardTestFiles': true,
    'maxInstances': 1,
    'browserName': 'chrome'
  },

  framework: 'jasmine2',
  getPageTimeout: 30000,
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000
  },
  plugins: [{
    package: 'protractor-console',
    logLevels: ['severe']
  }]
};
