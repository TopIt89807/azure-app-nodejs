// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

var mobileApps = require('..'),
    configuration = require('../src/configuration'),
    testDefaults = {
        skipVersionCheck: true,
        logging: false,
        basePath: __dirname,
        configFile: 'config.js'
    };


var api = module.exports = function (suppliedConfiguration, environment) {
    return mobileApps.create(api.configuration(suppliedConfiguration, environment));
};

api.ignoreEnvironment = function (suppliedConfiguration, environment) {
    return mobileApps.create(api.configuration.ignoreEnvironment(suppliedConfiguration, environment));
};

// we can expand this to provide different configurations for different environments
api.configuration = function (suppliedConfig) {
    return configuration.from()
        .defaults(testDefaults)
        .file()
        .environment()
        .object(suppliedConfig)
        .commandLine()
        .apply();
};

api.configuration.ignoreEnvironment = function (suppliedConfig) {
    return configuration.from()
        .defaults(testDefaults)
        .object(suppliedConfig)
        .commandLine()
        .apply();
};
