// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

var errors = require('../../../utilities/errors');

var helpers = module.exports = {
    mapParameters: function (parameters) {
        return parameters.reduce(function (result, parameter) {
            result[parameter.name] = parameter.value;
            return result;
        }, {});
    },
    translateVersion: function (items) {
        if(items) {
            if(items.constructor === Array)
                return items.map(helpers.translateVersion);

            if(items.version)
                items.version = items.version.toString('base64');

            return items;
        }
    },
    checkConcurrencyAndTranslate: function (results) {
        var recordsAffected = results[0][0].recordsAffected,
            records = results[1],
            item;

        if (records.length === 0)
            item = undefined;
        else if (records.length === 1)
            item = records[0];
        else
            item = records;

        item = helpers.translateVersion(item);

        if(recordsAffected === 0) {
            var error = errors.concurrency('No records were updated');
            error.item = item;
            throw error;
        }

        return item;
    }
}
