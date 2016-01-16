// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// we can expand this to provide different configurations for different environments
var configuration = require('../../../src/configuration'),
    mobileApp = require('../../..'),
    merge = require('deeply'),
    path = require('path'),
    environmentConfig = configuration.fromEnvironment(configuration.fromFile({}, path.resolve(__dirname, '../../config.js')));

// the very basics for testing
function testDefaults() {
    return configuration.fromCommandLine({
        skipVersionCheck: true,
        logging: false,
        basePath: __dirname,
        configFile: '../../config.js',
        data: {
            provider: 'memory'
        }
    });
}

var api = module.exports = function (suppliedConfig, environment) {
    var config = api.ignoreEnv(suppliedConfig);
    var configFile = path.resolve(config.basePath, config.configFile);
    config = configuration.fromFile(config, configFile);
    config = configuration.fromEnvironment(config, environment);
    config = configuration.fromSettingsJson(config); // not sure if this is tested?
    return config;
};

api.defaults = testDefaults;

api.ignoreEnv = function (suppliedConfig) {
    return merge(configuration.defaults(), testDefaults(), suppliedConfig);
};

api.data = function () {
    return environmentConfig.data;
};
