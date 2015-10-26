// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var path = require('path')
    fs = require('fs'),
    utilities = require('../utilities'),
    assert = require('../utilities/assert').argument;
    supportedExtensions = ['.js', '.json'];

var loader = module.exports = {
    importDefinitions: function (basePath, importDefinition) {
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

    loadPath: function (targetPath, basePath) {
        basePath = basePath || path.dirname(module.parent.filename);
        var fullPath = path.resolve(basePath, targetPath);

        // this won't work with other extensions (e.g. .ts, .coffee)
        // perhaps we should use require.resolve here instead - also enables loading modules in other packages
        if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
            // remove path extension
            var filesPath = fullPath;
            if(path.extname(fullPath))
                filesPath = fullPath.slice(0, -path.extname(fullPath).length)
            
            // get all files with supported extensions
            var filePaths = getFilePaths(filesPath);

            if (filePaths.length) {
                return loadFiles({}, filePaths);
            }
            else
                throw new Error('Requested configuration path (' + fullPath + ') does not exist');
        }
        else
            return loadDirectory({}, fullPath);
    }
}

function loadModule(target, targetPath) {
    var moduleName = path.basename(targetPath, path.extname(targetPath)),
        loadedModule = require(targetPath);
    // due to lexicographic ordering, .js is loaded before .json
    target[moduleName] = utilities.merge(target[moduleName] || {}, loadedModule);
    return target;
}

function loadDirectory(target, targetPath) {
    fs.readdirSync(targetPath).forEach(function (iterationPath) {
        var fullPath = path.join(targetPath, iterationPath);
        if (fs.statSync(fullPath).isDirectory())
            loadDirectory(target, fullPath);
        else
            loadModule(target, fullPath);
    });
    return target;
}

function getFilePaths(targetPath) {
    return supportedExtensions.map(function (extension) {
            return targetPath + extension;
        })
        .filter(function (path) {
            return fs.existsSync(path);
        });
}

function loadFiles(target, targetPaths) {
    targetPaths.forEach(function (path) {
        loadModule(target, path);
    });
    return target;
}