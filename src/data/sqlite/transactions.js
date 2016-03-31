var promises = require('../../utilities/promises');

module.exports = function (configuration, connection, statements) {
    // require here to avoid circular reference
    var execute = require('./execute');

    return promises.create(function (resolve, reject) {
        connection.beginTransaction(function (err, transaction) {
            if(err) reject(err);

            var results;

            promises.series(statements, function (statement) {
                return execute(configuration, statement, transaction)
                    .then(function (result) {
                        if(result)
                            results = result;
                    });
            })
            .then(function () {
                transaction.commit(function (err) {
                    if(err)
                        reject(err);
                    else
                        resolve(results);
                });
            })
            .catch(function (err) {
                transaction.rollback(function () {
                    reject(err);
                });
            });
        });
    });
};
