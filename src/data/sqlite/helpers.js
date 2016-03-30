// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

var types = require('../../utilities/types'),
    strings = require('../../utilities/strings'),
    transforms = require('./statements/transforms'),
    mssql = require('mssql');

var helpers = module.exports = {
    transforms: transforms,

    mapParameters: function (parameters) {
        return parameters.reduce(function (result, parameter) {
            result[parameter.name] = parameter.value;
            return result;
        }, {});
    },

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
            } else {
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

    formatTableName: function (tableName) {
        this.validateIdentifier(tableName);
        return '[' + tableName + ']';
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
                return "TEXT";
            case Number:
                return primaryKey ? "INTEGER" : "REAL";
            case Boolean:
                return "INTEGER";
            case Date:
                return "TEXT";
            default:
                throw new Error("Unable to map value " + value.toString() + " to a SQL type.");
        }
    },

    getPredefinedColumnType: function (value) {
        switch(value) {
            case 'string':
                return 'TEXT';
            case 'number':
                return 'REAL';
            case 'boolean':
            case 'bool':
                return 'INTEGER';
            case 'datetime':
            case 'date':
                return 'TEXT';
        }

        throw new Error('Unrecognised column type: ' + value);
    },

    getPredefinedType: function (value) {
        switch(value.toLowerCase()) {
            case 'text':
                return 'string';
            case 'real':
                return 'number';
            case 'integer':
                return 'boolean';
            default:
                return value.toLowerCase();
        }
    },

    getSystemPropertiesDDL: function () {
        return {
            version: 'version TEXT NOT NULL',
            createdAt: 'createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
            updatedAt: 'updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
            deleted: 'deleted INTEGER NOT NULL DEFAULT 0'
        }
    },

    getSystemProperties: function () {
        return Object.keys(helpers.getSystemPropertiesDDL());
    },

    isSystemProperty: function (property) {
        return helpers.getSystemProperties().some(function (systemProperty) { return property === systemProperty; });
    },
};
