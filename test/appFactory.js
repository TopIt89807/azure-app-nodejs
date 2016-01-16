// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var mobileApps = require('..'),
    loadConfiguration = require('../src/configuration'),

    testDefaults = {
        skipVersionCheck: true,
        logging: false,
        basePath: __dirname
    };

var api = function (configuration) {
    return mobileApps.create(api.configuration(configuration));
};

// export configuration mainly so tests can create data providers to execute drop table
api.configuration = function (configuration) {
    return loadConfiguration.from()
        .defaults(testDefaults)
        .file()
        .environment()
        .object(configuration)
        .commandLine()
        .apply();
};

api.ignoreEnvironment = function (configuration) {
    return mobileApps.create(loadConfiguration.from()
        .defaults(testDefaults)
        .object(configuration)
        .commandLine()
        .apply());
};

module.exports = api;
