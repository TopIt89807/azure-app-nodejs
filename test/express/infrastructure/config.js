// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// we can expand this to provide different configurations for different environments
var configuration = require('../../../src/configuration'),
    mobileApp = require('../../..'),
    merge = require('deeply'),
    path = require('path'),
    winston = require('winston');
    q = require('q'),
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

applyCommandLineArguments(testDefaults);

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

function applyCommandLineArguments(config) {
    var args = process.argv.slice(2),
        customArgs = {};

    // filter for custom arguments
    args.forEach(function (arg, index) {
        if (arg.slice(0, 3) === '---') {
            customArgs[arg.slice(3)] = args[index + 1];
        }
    });

    Object.keys(customArgs).forEach(function (property) {
        switch (property) {
            case 'logging.level':
                config.logging = {
                    level: customArgs[property],
                    transports: [
                        new (winston.transports.Console)({
                            colorize: true,
                            timestamp: true,
                            showLevel: true
                        })
                    ]
                };
                break;

            case 'promiseConstructor':
                if (customArgs[property] === 'q') {
                    config.promiseConstructor = q.Promise;
                }
                break;
        }
    });
}
