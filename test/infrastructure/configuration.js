// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// we can expand this to provide different configurations for different environments
var configuration = require('../../src/configuration'),
    testDefaults = {
        skipVersionCheck: true,
        logging: false,
        basePath: __dirname,
        configFile: '../config.js'
    };

var api = module.exports = function (suppliedConfig) {
    return configuration.from()
        .defaults(testDefaults)
        .file()
        .environment()
        .object(suppliedConfig)
        .commandLine()
        .configureGlobals()
        .configuration;
};

api.ignoreEnvironment = function (suppliedConfig) {
    return configuration.from()
        .defaults(testDefaults)
        .object(suppliedConfig)
        .commandLine()
        .configureGlobals()
        .configuration;
};
