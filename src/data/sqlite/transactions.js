// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var connectionPool = require('./connectionPool'),
    execute = require('./execute'),
    promises = require('../../utilities/promises');

module.exports = function (configuration) {
    var pool = connectionPool(configuration);
    
    return function (statements) {
        return promises.create(function (resolve, reject) {
            var connection = pool.obtain(),
                results;
                
            connection.serialize(function () {
                connection.run('BEGIN TRANSACTION');
                
                return promises.all(statements.map(function (statement) {
                    return execute(connection, statement)
                        .then(function (result) {
                            if(result)
                                results = result;
                        });
                }))            
                .then(function () {
                    connection.run('COMMIT TRANSACTION', function (err) {
                        pool.release(connection);
                        if(err)
                            reject(err);
                        else
                            resolve(results);
                    });
                })
                .catch(function (err) {
                    connection.run('ROLLBACK TRANSACTION', function () {
                        pool.release(connection);
                        reject(err);
                    });
                });
            });
        });
    };
};
