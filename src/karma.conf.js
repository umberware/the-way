// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage-istanbul-reporter'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      client: {
        clearContext: false
      },
      coverageIstanbulReporter: {
          dir: require('path').join(__dirname, '../coverage'),
          reports: ['html', 'lcovonly'],
          fixWebpackSourcePaths: true,
          thresholds: {
              emitWarning: false,
              global: {
                  statements: 20,
                  lines: 20,
                  branches: 10,
                  functions: 20
              }
          }   
      },
      reporters: ['progress', 'kjhtml'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['Chrome', 'CustomChromeHeadless'],
      customLaunchers: {
        CustomChromeHeadless: {
          base: 'ChromeHeadless',
          flags: [
            '--no-sandbox'
          ]
        }
      }
    });
};
  