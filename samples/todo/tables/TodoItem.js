var mobileApp = require('azure-mobile-apps');
// Create a new table
var todoTable = mobileApp.table();
// Export the table
module.exports = todoTable;

todoTable.read(function(context) {
  context.execute();
});
