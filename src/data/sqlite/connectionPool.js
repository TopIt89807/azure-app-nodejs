var sqlite3 = require('sqlite3'),
    free = [],
    memoryConnection;

module.exports = function (configuration) {
    configuration = configuration || {};
    configuration.filename = configuration.filename || ':memory:';

    return {
        obtain: function () {
            if(configuration.filename === ':memory:') {
                // we can only have a single connection to an in memory database
                if(!memoryConnection)
                    memoryConnection = new sqlite3.Database(configuration.filename);
                return memoryConnection;
            
            } else if(free.length > 0) { 
                return free.shift();
            
            } else {
                return new sqlite3.Database(configuration.filename);
            }
        },
        release: function (connection) {
            if(configuration.filename !== ':memory:')
                free.push(connection);
        }
    };
};
    