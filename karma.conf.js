var webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    plugins : ['karma-mocha', 'karma-chai', 'karma-sinon', 'karma-webpack', 'karma-phantomjs-launcher'],
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'test/**/*.ts',
      'src/**/*.ts'
    ],
    exclude: [
    ],
    preprocessors: {
      'test/**/*.ts': ['webpack']
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity
  })
}
