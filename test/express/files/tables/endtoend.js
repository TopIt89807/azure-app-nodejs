var table = module.exports = require('../../../../src/express').table();

table.softDelete = true;

table.read.use(modifyQuery, table.operation, appendProperty('readMiddleware', 'read'));
table.read(function (context) {
    return context.execute().then(function (results) {
        results.forEach(function (item) {
            item.readOperation = 'read';
        });
        return results;
    });
})

table.insert.use(appendProperty('insertMiddleware', 'insert'), table.operation);
table.insert(function (context) {
    context.item.insertOperation = 'insert';
    return context.execute();
});

table.update.use(appendProperty('updateMiddleware', 'update'), table.operation);
table.update(function (context) {
    context.item.updateOperation = 'update';
    return context.execute();
});

table.delete.use(table.operation, appendProperty('deleteMiddleware', 'delete'));
table.delete(function (context) {
    return context.execute().then(function (item) {
        item.deleteOperation = 'delete';
        return item;
    });
});

table.undelete.use(table.operation, appendProperty('undeleteMiddleware', 'undelete'));
table.undelete(function (context) {
    return context.execute().then(function (item) {
        item.undeleteOperation = 'undelete';
        return item;
    });
});

function modifyQuery(req, res, next) {
    req.azureMobile.query.where({ clientValue: 'show' });
    next();
}

function appendProperty(name, value) {
    return function (req, res, next) {
        if(res.results) {
            if(res.results.forEach)
                res.results.forEach(function (item) {
                    item[name] = value;
                });
            else
                res.results[name] = value;
        } else if (req.azureMobile.item)
            req.azureMobile.item[name] = value;
        next();
    }
}
