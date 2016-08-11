// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// translate http requests into a data operation
module.exports = {
    get: function (req, res) {
        var context = req.azureMobile;
        context.operation = 'read';
        return context.data(context.table, context).read(context.query);
    },
    post: function (req, res) {
        var context = req.azureMobile;
        if(context.query) {
            context.operation = 'undelete';
            return context.data(context.table, context).undelete(context.query, context.version);
        } else {
            context.operation = 'create';
            return context.data(context.table, context).insert(context.item);
        }
    },
    patch: function (req, res) {
        var context = req.azureMobile;
        context.operation = 'update';
        return context.data(context.table, context).update(context.item, context.query);
    },
    delete: function (req, res) {
        var context = req.azureMobile;
        context.operation = 'delete';
        return context.data(context.table, context).delete(context.query, context.version);
    }
}
