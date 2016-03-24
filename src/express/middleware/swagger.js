// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var swaggerui = require('./swagger-ui'),
    swagger = require('../../swagger'),
    promises = require('../../utilities/promises'),
    express = require('express');

module.exports = function(configuration) {
    var router = express.Router();

    router.use('/ui', swaggerui(configuration));
    router.use('/', metadata);

    return router;

    function metadata(req, res, next) {
        if(configuration.swagger) {
            var data = req.azureMobile.data,
                host = req.get('host');

            getTableSchemas()
                .then(function (schemas) {
                    res.json(swagger(configuration)('/', host, schemas, [scheme()]));
                })
                .catch(next);
                
        } else {
            res.status(404).send("To access swagger definitions, you must enable swagger support by adding swagger: true to your configuration")
        }

        function getTableSchemas() {
            var tables = configuration.tables;
            return promises.all(Object.keys(tables).map(function (tableName) {
                var schemaFactory = data(tables[tableName]).schema;
                if(!schemaFactory)
                    throw new Error('The selected data provider does not support the schema function required for swagger');
                return schemaFactory();
            }));
        }

        function scheme() {
            return req.get('x-arr-ssl') ? 'https' : 'http';
        }
    }
};
