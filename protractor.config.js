exports.config = {

  specs: ['tests/tests/*.js'],

  capabilities: {
    'shardTestFiles': true,
    'maxInstances': 1,
    'browserName': 'chrome'
  },

  framework: 'jasmine2',
  chromeDriver: './node_modules/chromedriver/lib/chromedriver/chromedriver',
  // Options to be passed to Jasmine.
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
