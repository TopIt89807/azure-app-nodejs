// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var loader = require('./loader'),
    assert = require('../utilities/assert').argument;

module.exports = {
    import: function (basePath, importDefinition) {
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
    },
    setAccess: function (definition, method) {
        resolveProperty('authorize');
        resolveProperty('disable');

        var access = definition[method].access;
        if (access) {
            definition[method].authorize = access === 'authenticated';
            definition[method].disable = access === 'disabled';
        }

        function resolveProperty(property) {
            if (definition[method].hasOwnProperty(property)) { 
                // already set on operation, do nothing
            } else if (definition.hasOwnProperty(property)) {
                // use table default if exists
                definition[method][property] = definition[property]
            } else {
                // if no setting, use false
                definition[method][property] = false;
            }
        }
    }
}