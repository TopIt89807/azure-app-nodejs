# Creating Data Providers for the Azure Mobile Apps SDK for Node

Data providers should implement the following interface:

````
read: function (query) { },
update: function (item) { },
insert: function (item) { },
delete: function (id, version) { },
undelete: function (id, version) { },
truncate: function () { },
initialize: function () { }
````

All functions should return a promise, as constructed by the `create` function in the `azure-mobile-apps/src/utilities/promises` module.

## read

The read function should resolve to a result set that the Mobile Apps client SDK expects.
- For normal queries, this should be an array of results.
- When the provided query has the `single` property set, this should be a single object.
  If the item does not exist, it should resolve to undefined.
- When the provided query has the `includeTotalCount` property set, this should be an object
  with results and count properties.
- When the provided query has the `includeDeleted` property set, the results should include
  soft deleted items.

## update

The update function should update the item with the corresponding `id` in the database.
- If the `version` property is specified, it should only update the record if the `version`
  property matches.
- If the `version` property does not match, an `Error` should be thrown with the `concurrency`
  property set to true.
- The `updatedAt` property should be updated to the current date and time.
- The `version` property should be updated to a new unique value.

## insert

The insert function should insert a new record into the database.
- If an item with the same `id` property already exists, an `Error` should be thrown with
  the `duplicate` property set.
- The `createdAt` and `updatedAt` properties should be set to the current date and time.
- The `version` property should be set to a unique value.
