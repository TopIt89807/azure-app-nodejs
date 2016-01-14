// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var errors = require('../../utilities/errors'),
    express = require('express'),
    path = require('path');

module.exports = function(configuration) {
    var swaggerPath = resolveSwaggerUi(),
        middleware = swaggerPath && express.static(swaggerPath);

    return function (req, res, next) {
        if(swaggerPath) {
            if(!req.query.url)
                res.redirect('?url=' + swaggerUrl());
            else
                middleware(req, res, next);
        } else {
            next(errors.notFound());
        }

        function swaggerUrl() {
            // this is a bit of a hack and assumes swagger metadata is exposed in the parent directory
            var swaggerPath = path.join(req.originalUrl, '..').replace(/\\/g, '/'),
                // requests are always http from the Azure Web Apps front end to the worker - detect using headers that ARR attaches
                protocol = (req.headers['x-forwarded-proto'] === 'https' || req.headers['x-arr-ssl']) ? 'https' : 'http';
            return protocol + '://' + req.get('host') + swaggerPath;
        }
    };

    function resolveSwaggerUi() {
        try {
            return path.dirname(require.resolve('swagger-ui'));
        } catch(error) { }
    }
};
