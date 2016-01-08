// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var swagger = require('../../swagger'),
    promises = require('../../utilities/promises');

module.exports = function(configuration) {
    return function (req, res, next) {
        var data = req.azureMobile.data;

        getTableSchemas()
            .then(function (schemas) {
                res.json(swagger(configuration)(baseUrl(), schemas));
            })
            .catch(next);

        function baseUrl() {
            return req.protocol + '://' + req.hostname + '/' + req.baseUrl;
        }

        function getTableSchemas() {
            var tables = configuration.tables;
            return promises.all(Object.keys(tables).map(function (tableName) {
                return data(tables[tableName]).schema();
            }));
        }
    };
};
