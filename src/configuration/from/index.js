// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var merge = require('../../utilities/merge').mergeObjects,
    sources = {
        commandLine: require('./commandLine'),
        defaults: require('./defaults'),
        environment: require('./environment'),
        file: require('./file'),
        settingsJson: require('./settingsJson')
    };

module.exports = merge(fluentApi, sources);

function fluentApi(configuration) {
    var api = Object.keys(sources).reduce(function (target, name) {
        target[name] = function () {
            var args = Array.prototype.slice.apply(arguments);
            configuration = sources[name].apply(undefined, [configuration].concat(args))
            api.configuration = configuration;
            return api;
        };
        return target;
    }, {});
    return api;
}
