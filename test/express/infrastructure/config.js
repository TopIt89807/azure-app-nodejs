// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// we can expand this to provide different configurations for different environments
var configuration = require('../../../src/configuration'),
    path = require('path'),
    merge = require('deeply'),
    winston = require('winston');
    q = require('q');

// initialize configuration for testing
var config = configuration.fromEnvironment(configuration.fromFile(path.resolve(__dirname, '../../config.js')), process.env);
// default to skipping version check
config.skipVersionCheck = true;
// default to no logging
config.logging = {};
config.basePath = __dirname;
applyCommandLineArguments(config);

var api = module.exports = function (userSuppliedConfig) {
    return merge(config, userSuppliedConfig);
}

api.memory = function (userSuppliedConfig) {
    return merge(config, { data: { provider: 'memory' }}, userSuppliedConfig);
}

api.data = function (userSuppliedDataConfig) {
    return merge(config.data, userSuppliedDataConfig);
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