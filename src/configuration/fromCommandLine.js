// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var q = require('q'),
    winston = require('winston');

// if this gets much more complex, we should change to using something like optimist
// this method modifies the original configuration parameter
module.exports = function (configuration, commandLineArguments) {
    var args = commandLineArguments || process.argv.slice(2),
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
                configuration.logging = {
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
                    configuration.promiseConstructor = q.Promise;
                }
                break;
        }
    });

    return configuration;
}
