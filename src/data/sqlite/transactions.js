// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var promises = require('../../utilities/promises');

module.exports = function (configuration, connection, statements) {
    // require here to avoid circular reference
    var execute = require('./execute'),
        results;

    return promises.create(function (resolve, reject) {
        connection.serialize(function () {
            return promises.all(statements.map(function (statement) {
                return execute(configuration, statement)
                    .then(function (result) {
                        if(result)
                            results = result;
                    });
            }))            
            .then(function () {
                resolve(results);
            })
            .catch(function (err) {
                reject(err);
            });
        });
        
        // the sqlite3-transactions module hacks in "transactions" by preventing other
        // statements from executing until the transaction has completed, but the 
        // package is somewhat immature
        
        // connection.beginTransaction(function (err, transaction) {
        //     if(err) reject(err);

        //     var results;

        //     promises.series(statements, function (statement) {
        //         return execute(configuration, statement, transaction)
        //             .then(function (result) {
        //                 if(result)
        //                     results = result;
        //             });
        //     })
        //     .then(function () {
        //         transaction.commit(function (err) {
        //             if(err)
        //                 reject(err);
        //             else
        //                 resolve(results);
        //         });
        //     })
        //     .catch(function (err) {
        //         transaction.rollback(function () {
        //             reject(err);
        //         });
        //     });
        // });
    });
};
