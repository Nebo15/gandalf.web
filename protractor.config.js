
exports.config = {

    specs: ['tests/tests/*.js'],

    seleniumAddress: 'http://localhost:4444/wd/hub',
    multiCapabilities: [
      {
        'browserName': 'firefox'
      }
    ],

    framework: 'jasmine2',

    // Options to be passed to Jasmine.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    },
    plugins: [{
        package: 'protractor-console',
        logLevels: ['severe']
    }]
};