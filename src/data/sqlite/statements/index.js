// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
module.exports = {
    insert: require('./insert'),
    update: require('./update'),
    delete: require('./delete'),
    read: require('./read'),
    truncate: require('./truncate'),
    createTable: require('./createTable'),
    updateSchema: require('./updateSchema'),
    undelete: require('./undelete'),
    createIndex: require('./createIndex'),
    createTrigger: require('./createTrigger'),
    createColumnsTable: require('./createColumnsTable'),
    setColumns: require('./setColumns')
};
