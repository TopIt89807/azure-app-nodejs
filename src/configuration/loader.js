// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var path = require('path')
    fs = require('fs');

module.exports = {
    loadPath: function (targetPath, basePath) {
        basePath = basePath || path.dirname(module.parent.filename);
        var fullPath = path.resolve(basePath, targetPath);

        // this won't work with other extensions (e.g. .ts, .coffee)
        // perhaps we should use require.resolve here instead - also enables loading modules in other packages
        if (!fs.existsSync(fullPath)) {
            if (fs.existsSync(fullPath + '.js'))
                fullPath += '.js';
            else
                throw new Error('Requested configuration path (' + fullPath + ') does not exist');
        }

        if (fs.statSync(fullPath).isDirectory())
            return loadDirectory({}, fullPath);
        else
            return loadModule({}, fullPath);
    }
}

function loadModule(target, targetPath) {
    var moduleName = path.basename(targetPath, path.extname(targetPath)),
        loadedModule = require(targetPath);
    target[moduleName] = loadedModule;
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
