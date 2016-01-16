// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// we can expand this to provide different configurations for different environments
var configuration = require('../../../src/configuration'),
    mobileApp = require('../../..'),
    merge = require('deeply'),
    path = require('path'),
    environmentConfig = configuration.fromEnvironment(configuration.fromFile(path.resolve(__dirname, '../../config.js')), process.env);

// initialize configuration for testing
var testDefaults = {
    skipVersionCheck: true,
    logging: false,
    basePath: __dirname,
    configFile: '../../config.js',
    data: {
        provider: 'memory'
    }
}

configuration.fromCommandLine(testDefaults);

var api = module.exports = function (userConfig, environment) {
    var config = api.ignoreEnv(userConfig);
    var configFile = path.resolve(config.basePath, config.configFile);
    config = merge(config, configuration.fromFile(configFile));
    configuration.fromEnvironment(config, environment || process.env);
    configuration.fromSettingsJson(config);
    return config;
}

api.ignoreEnv = function (userConfig) {
    return merge(mobileApp.defaultConfig(), testDefaults, userConfig);
}

api.data = function () {
    return environmentConfig.data;
};
