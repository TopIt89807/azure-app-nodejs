var sqlite3 = require('sqlite3'),
    connections = {};
    
module.exports = function (configuration) {
    var filename = (configuration && configuration.filename) || ':memory:';
    
    if(!connections[filename])
        connections[filename] = new sqlite3.cached.Database(filename);
        
    return connections[filename];
};


