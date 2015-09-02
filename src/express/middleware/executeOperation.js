// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
﻿var promises = require('../../utilities/promises'),
    dataOperations = require('../tables/operations');

// execute the requested operation and attach the results to res
module.exports = function (operations) {
    return function (req, res, next) {
        var verb = req.method.toLowerCase(),
            context = req.azureMobile || {};

        context.execute = execute;

        // if a custom operation has been defined, execute it
        if (operations && operations[verb]) {
            var results = operations[verb](context);

            if (promises.isPromise(results))
                results.then(setResults, next);
            else
                setResults(results);
        } else {
            execute().then(setResults, next);
        }

        function execute() {
            return dataOperations[verb](req, res);
        }

        function setResults(results) {
            res.results = results;
            next();
        }
    };
}
