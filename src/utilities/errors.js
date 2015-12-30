var util = require('util');

function addFactory(target, type) {
    target[type] = function(message) {
        var error = new Error(util.format.apply(null, arguments));
        error[type] = true;
        return error;
    };
    return target;
}

module.exports = ['badRequest', 'conflict', 'concurrency', 'duplicate', 'notFound'].reduce(addFactory, {});
