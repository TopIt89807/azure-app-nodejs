// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// we can expand this to provide different configurations for different environments
var configuration = require('../../../src/configuration'),
    path = require('path'),
    testDefaults = {
        skipVersionCheck: true,
        logging: false,
        basePath: __dirname,
        configFile: '../../config.js'
    };

var api = module.exports = function (suppliedConfig, environment) {

return configuration.from()
    .defaults(testDefaults)
    .file()
    .environment(environment)
    .object(suppliedConfig)
    .commandLine()
    .configuration;
};

api.defaults = testDefaults;

api.ignoreEnv = function (suppliedConfig) {
    return configuration.from()
        .defaults(testDefaults)
        .object(suppliedConfig)
        .commandLine()
        .configuration;
};

api.data = function () {
    return configuration.from(testDefaults)
        .file()
        .environment()
        .commandLine()
        .configuration
        .data;
};
