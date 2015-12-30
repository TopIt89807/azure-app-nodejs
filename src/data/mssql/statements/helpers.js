module.exports = {
    translateVersion: function (items) {
        if(items) {
            if(items.constructor === Array)
                return items.map(module.exports.translateVersion);

            if(items.version)
                items.version = items.version.toString('base64');

            return items;
        }
    },
    combineStatements: function (statements, transform) {
        return statements.reduce(function(target, statement) {
            target.sql += statement.sql + '; ';

            if (statement.parameters)
                target.parameters = target.parameters.concat(statement.parameters);

            return target;
        }, { sql: '', parameters: [], multiple: true, transform: transform });
    }
}
