var webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha','chai-as-promised', 'chai', 'sinon'],
    files: [
      'test/**/*.ts'
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
    hostname: '0.0.0.0',
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [],
    singleRun: false,
    concurrency: Infinity
  })
}
