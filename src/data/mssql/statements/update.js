// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var helpers = require('../helpers'),
    errors = require('../../../utilities/errors'),
    mssql = require('mssql'),
    _ = require('underscore.string');

module.exports = function (table, item) {
    var tableName = helpers.formatTableName(table.schema || 'dbo', table.name),
        setStatements = [],
        versionValue,
        parameters = [];

    for (var prop in item) {
        if(item.hasOwnProperty(prop)) {
            var value = item[prop];

            if (prop.toLowerCase() === 'version') {
                versionValue = value;
            } else if (helpers.isSystemProperty(prop)) {
                throw errors.badRequest('Cannot update item with property ' + prop + ' as it is reserved');
            } else if (prop.toLowerCase() !== 'id') {
                setStatements.push(helpers.formatMember(prop) + ' = @' + prop);
                parameters.push({ name: prop, value: value, type: helpers.getMssqlType(value) });
            }
        }
    }

    var sql = _.sprintf("UPDATE %s SET %s WHERE [id] = @id ", tableName, setStatements.join(','));
    parameters.push({ name: 'id', type: helpers.getMssqlType(item.id, true), value: item.id });

    if (versionValue) {
        sql += "AND [version] = @version ";
        parameters.push({ name: 'version', type: mssql.VarBinary, value: new Buffer(versionValue, 'base64') })
    }

    sql += _.sprintf("; SELECT @@ROWCOUNT as recordsAffected; SELECT * FROM %s WHERE [id] = @id", tableName);

    return {
        sql: sql,
        parameters: parameters,
        multiple: true,
        transform: helpers.statements.checkConcurrencyAndTranslate
    };
};
