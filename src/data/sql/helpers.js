// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

var types = require('../../utilities/types'),
    strings = require('../../utilities/strings'),
    mssql = require('mssql');

module.exports = {
    // Performs the following validations on the specified identifier:
    // - first char is alphabetic or an underscore
    // - all other characters are alphanumeric or underscore
    // - the identifier is LTE 128 in length
    isValidIdentifier: function (identifier) {
        if (!identifier || !types.isString(identifier) || identifier.length > 128) {
            return false;
        }

        for (var i = 0; i < identifier.length; i++) {
            var char = identifier[i];
            if (i === 0) {
                if (!(strings.isLetter(char) || (char == '_'))) {
                    return false;
                }
            }
            else {
                if (!(strings.isLetter(char) || strings.isDigit(char) || (char == '_'))) {
                    return false;
                }
            }
        }

        return true;
    },

    validateIdentifier: function (identifier) {
        if (!this.isValidIdentifier(identifier)) {
            throw new Error(identifier + " is not a valid identifier. Identifiers must be under 128 characters in length, start with a letter or underscore, and can contain only alpha-numeric and underscore characters.");
        }
    },

    formatTableName: function (schemaName, tableName) {
        schemaName = module.exports.formatSchemaName(schemaName);
        this.validateIdentifier(schemaName);
        this.validateIdentifier(tableName);
        return '[' + schemaName + '].[' + tableName + ']';
    },

    formatSchemaName: function (appName) {
        // Hyphens are not supported in schema names
        return appName.replace(/-/g, '_');
    },

    formatMember: function (memberName) {
        this.validateIdentifier(memberName);
        return '[' + memberName + ']';
    },

    getSqlType: function (value, primaryKey) {
        if(value === undefined || value === null)
            throw new Error('Cannot create column for null or undefined value');

        switch (value.constructor) {
            case String:
                // 900 bytes is the maximum length for a primary key - http://stackoverflow.com/questions/10555642/varcharmax-column-not-allowed-to-be-a-primary-key-in-sql-server
                return primaryKey ? "NVARCHAR(255)" : "NVARCHAR(MAX)";
            case Number:
                return primaryKey ? "INT" : "FLOAT(53)";
            case Boolean:
                return "BIT";
            case Date:
                return "DATETIMEOFFSET(3)";
            default:
                throw new Error("Unable to map value " + value.ToString() + " to a SQL type.");
        }
    },

    getMssqlType: function (value, primaryKey) {
        switch (value && value.constructor) {
            case String:
                return primaryKey ? mssql.NVarChar(255) : mssql.NVarChar();
            case Number:
                return primaryKey || isInteger(value) ? mssql.Int : mssql.Float;
            case Boolean:
                return mssql.Bit;
            case Date:
                return mssql.DateTimeOffset;
            case Buffer:
                return mssql.VarBinary;
        }

        function isInteger(value) {
            return value.toFixed() === value.toString();
        }
    },

    getPredefinedColumnType: function (value) {
        switch(value) {
            case 'string':
                return 'NVARCHAR(MAX)';
            case 'number':
                return 'FLOAT(53)';
            case 'boolean':
            case 'bool':
                return 'BIT';
            case 'datetime':
            case 'date':
                return 'DATETIMEOFFSET(3)';
        }

        throw new Error('Unrecognised column type: ' + value);
    },

    getPredefinedType: function (value) {
        switch(value) {
            case 'nvarchar':
                return 'string';
            case 'float':
                return 'number';
            case 'bit':
                return 'boolean';
            case 'datetimeoffset':
                return 'datetime';
            default:
                return value;
        }
    },
};
