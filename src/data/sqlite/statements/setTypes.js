var insert = require('./insert'),
    helpers = require('../helpers');

module.exports = function (table, item) {
    var statements = Object.keys(item).map(function (property) {
        return insert({ name: '__types' }, {
            table: table.name,
            name: property,
            type: helpers.getSchemaType(item[property])
        })[0];
    });

    statements.unshift({
        sql: "DELETE FROM [__types] WHERE [table] = @table",
        parameters: {
            table: table.name
        }
    });

    return statements;
}
