// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var express = require('express'),
    log = require('../../logger');

module.exports = function (rootPath) {
    var router = express.Router(),
        result = function (req, res, next) {
            router(req, res, next);
        };

    result.add = function (name, definition) {
        if (definition.createMiddleware)
            definition = definition.createMiddleware(name);

        log.debug("Adding table definition for " + name);
        router.use('/', definition);
    };

    result.stack = router.stack;

    return result;
}
