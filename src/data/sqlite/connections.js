var sqlite3 = require('sqlite3'),
    promises = require('../../utilities/promises'),
    free = [],
    memoryConnection;

module.exports = {
    // this assumes the same configuration is passed in each time, or things will break
    // it could easily be adapted to have an array of connections per filename
    obtain: function (configuration) {
        // we can only have a single connection to an in-memory database
        if(!configuration.filename || configuration.filename === ':memory:') {
            if(!memoryConnection)
                memoryConnection = new sqlite3.Database(':memory:');
            return memoryConnection;
            
        } else if(free.length > 0) { 
            return free.shift();
        
        } else {
            return new sqlite3.Database(configuration.filename);
        }
    },
    release: function (connection) {
        free.push(connection);
    }
};
