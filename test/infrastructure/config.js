// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// we can expand this to provide different configurations for different environments
var configuration = require('../../src/configuration'),
    path = require('path'),
    testDefaults = {
        skipVersionCheck: true,
        logging: false,
        basePath: path.resolve(__dirname, '../express/infrastructure/'), // this is what it used to be, need to refactor this out
        configFile: '../../config.js'
    };

// this is the default test configuration that takes into account the config.js file and/or environment settings
var api = module.exports = function (suppliedConfig) {
    return configuration.from()
        .defaults(testDefaults)
        .file()
        .environment()
        .object(suppliedConfig)
        .commandLine()
        .configuration;
};

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
