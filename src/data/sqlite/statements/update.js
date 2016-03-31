// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers'),
    format = require('azure-odata-sql').format,
    queries = require('../../../query'),
    mssql = require('mssql'),
    _ = require('underscore.string');

module.exports = function (table, item, query) {
    var tableName = helpers.formatTableName(table.name),
        setStatements = [],
        versionValue,
        filter = filterClause(),
        updateParameters = helpers.mapParameters(filter.parameters);

    for (var property in item) {
        if(item.hasOwnProperty(property)) {
            var value = item[property];

            if (property.toLowerCase() === 'version') {
                versionValue = value;
            } else if (property.toLowerCase() !== 'id') {
                setStatements.push(helpers.formatMember(property) + ' = @' + property);
                updateParameters[property] = value;
            }
        }
    }

    updateParameters.id = item.id;

    var updateStatement = {
        sql: _.sprintf("UPDATE %s SET %s WHERE [id] = @id%s", tableName, setStatements.join(','), filter.sql),
        parameters: updateParameters
    };

    if (versionValue) {
        updateStatement.sql += " AND [version] = @version";
        updateStatement.parameters.version = versionValue;
    }


    var countStatement = {
        sql: "SELECT changes() AS recordsAffected",
        transform: helpers.transforms.checkConcurrency
    };


    var selectParameters = helpers.mapParameters(filter.parameters);
    selectParameters.id = item.id;

    var selectStatement = {
        sql: _.sprintf("SELECT * FROM %s WHERE [id] = @id%s", tableName, filter.sql),
        parameters: selectParameters,
        transform: helpers.transforms.prepareItems(table)
    };

    return [updateStatement, countStatement, selectStatement];

    function filterClause() {
        if(!query)
            return { sql: '', parameters: [] };

        var filter = format.filter(queries.toOData(query), 'q');
        if(filter.sql)
            filter.sql = ' AND ' + filter.sql;

        return filter;
    }
};
