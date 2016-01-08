// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var swagger = require('../../swagger');

module.exports = function(configuration) {
    return function (req, res, next) {
        res.json(swagger(configuration)(baseUrl()));

        function baseUrl() {
            return req.protocol + '://' + req.hostname + '/' + req.baseUrl;
        }
    };
};
