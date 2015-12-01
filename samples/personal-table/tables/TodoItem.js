var azureMobileApps = require('azure-mobile-apps');

var table = azureMobileApps.table();

// Defines the list of columns
table.columns = {
    "userId": "string",
    "text": "string",
    "complete": "boolean"
};
// Turns off dynamic schema
table.dynamicSchema = false;

// Must be authenticated for this to work
table.access = 'authenticated';

// Ensure only records belonging to the authenticated user are retrieved
table.read(function (context) {
    context.query.where({ userId: context.user.id });
    return context.execute();
});

// When adding record, add or overwrite the userId with the authenticated user
table.insert(function (context) {
    context.item.userId = context.user.id;
    return context.execute();
});

module.exports = table;