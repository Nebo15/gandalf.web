module.exports = function(config){
  config.set({

    basePath : './src',

    files : [
      'js/app.js',
      'js/**/*_test.js'
    ],
    autoWatch : true,

    frameworks: ['jasmine', 'bower'],

    browsers : ['Chrome'],

    plugins : [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-bower'
    ],

    bowerPackages: [
    ],

    junitReporter : {
      outputFile: '.karma/output/unit.xml',
      suite: 'unit'
    }

  });
};
