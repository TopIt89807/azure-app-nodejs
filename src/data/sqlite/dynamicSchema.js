// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var execute = require('./execute'),
    promises = require('../../utilities/promises'),
    schemas = require('./schema'),
    errorTypes = require('./errorTypes');

module.exports = function (table) {
    var api = {
        execute: function (config, statement, item, attempt) {
            var schema = schemas(config);
            attempt = attempt || 1;

            return execute(config, statement)
                .catch(function (err) {
                    return handleError(err).then(function () {
                        return api.execute(table, statement, item, attempt + 1);
                    });
                });

            function handleError(err) {
                if (attempt >= 3)
                    return promises.rejected(err);

                if(errorTypes.isMissingTable(err))
                    return schema.createTable(table, item);
                if(errorTypes.isMissingColumn(err))
                    return schema.updateSchema(table, item);

                return promises.rejected(err);
            }
        },
        read: function (config, statement) {
            return execute(config, statement)
                .catch(function (err) {
                    // if dynamic schema is enabled and the error is invalid column, it is likely that the schema has not been
                    // updated to include the column. V1 behavior is to return an empty array, maintain this behavior.
                    if(errorTypes.isMissingTable(err) || errorTypes.isMissingColumn(err)) {
                        var result = [];
                        return result;
                    }
                    throw err;
                });
        }
    };

    return api;
};
