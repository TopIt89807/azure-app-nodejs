// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var merge = require('../../utilities/merge').mergeObjects,
    logger = require('../../logger'),
    promises = require('../../utilities/promises'),
    sources = {
        commandLine: require('./commandLine'),
        defaults: require('./defaults'),
        environment: require('./environment'),
        file: require('./file'),
        object: require('./object'),
        settingsJson: require('./settingsJson')
    };

module.exports = merge(fluentApi, sources);

function fluentApi(configuration) {
    configuration = configuration || {};

    // for each configuration source above, add a function that applies changes to the above configuration variable and returns the same api (i.e. fluent)
    // each source module must export a function with the configuration object as the first parameter, others are optional and passed on
    var api = Object.keys(sources).reduce(function (target, name) {
        target[name] = function () {
            var args = Array.prototype.slice.apply(arguments);
            configuration = sources[name].apply(undefined, [configuration].concat(args))
            return api;
        };
        return target;
    }, {});

    api.apply = function () {
        module.exports.configureGlobals(configuration);
        return configuration;
    };

    return api;
}

// yeh maybe not the best place
module.exports.configureGlobals = function (configuration) {
    logger.configure(configuration.logging);
    promises.setConstructor(configuration.promiseConstructor);
};
