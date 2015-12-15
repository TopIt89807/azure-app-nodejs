// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// we can expand this to provide different configurations for different environments
var configuration = require('../../../src/configuration'),
    path = require('path'),
    winston = require('winston');
    q = require('q');

var api = module.exports = function () {
    var config = configuration.fromEnvironment(configuration.fromFile(path.resolve(__dirname, '../../config.js')), process.env);
    config.basePath = __dirname;
    applyCommandLineArguments(config);
    return config;
}

api.data = function () {
    return api().data;
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