// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var loader = require('../../configuration/loader'),
    assert = require('../../utilities/assert').argument;

module.exports = function (basePath, importDefinition) {
    return function (path) {
        assert(path, 'A path to a configuration file(s) was not specified');
        var definitions = loader.loadPath(path, basePath);
        Object.keys(definitions).forEach(function (name) {
            var definition = definitions[name];

            if (definition && definition.name)
                name = definition.name;

            importDefinition(name, definition);
        });
    }
}
