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

    // for each configuration source above, add a function that applies changes to the above configuration variable and returns the same api (fluent)
    var api = Object.keys(sources).reduce(function (target, name) {
        target[name] = function () {
            var args = Array.prototype.slice.apply(arguments);
            configuration = sources[name].apply(undefined, [configuration].concat(args))
            api.configuration = configuration;
            return api;
        };
        return target;
    }, {});

    api.configureGlobals = function () {
        module.exports.configureGlobals(configuration);
        return api;
    };

    return api;
}

// yeh maybe not the best place
module.exports.configureGlobals = function (configuration) {
    logger.configure(configuration.logging);
    promises.setConstructor(configuration.promiseConstructor);
};
