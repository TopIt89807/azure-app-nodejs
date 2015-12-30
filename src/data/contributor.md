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

The query parameter is a object representation of OData with corresponding property names
without the $ prefix.

The read function should resolve to a result set that the Mobile Apps client SDK expects.
- For normal queries, this should be an array of results.
- When the provided query has the `single` property set, this should be a single object.
  If the item does not exist, it should resolve to undefined.
- When the provided query has the `includeTotalCount` property set, this should be an object
  with results and count properties.
- When the provided query has the `includeDeleted` property set, the results should include
  soft deleted items.

## update

The update function should update the item with the corresponding `id` in the database
and resolve to the updated item.
- If the `version` property is specified, it should only update the record if the `version`
  property matches.
- If the `version` property does not match, an `Error` should be thrown with the `concurrency`
  property set to true.
- The `updatedAt` property should be updated to the current date and time.
- The `version` property should be updated to a new unique value.

## insert

The insert function should insert a new record into the database and resolve to
the inserted item.
- If an item with the same `id` property already exists, an `Error` should be thrown with
  the `duplicate` property set.
- The `createdAt` and `updatedAt` properties should be set to the current date and time.
- The `version` property should be set to a unique value.

## delete

The delete function should delete the record with the corresponding `id` property
and resolve to the deleted item.
- If the `version` parameter is specified, it should only delete the record if the `version`
  property matches.
- If the `version` property does not match, an `Error` should be thrown with the `concurrency`
  property set to true.
- If the `softDelete` option is specified on the table configuration, the record should be
  recoverable by calling undelete, and should be queryable by specifying the `includeDeleted`
  option on read queries.

## undelete
The undelete function should restore the record with the corresponding `id` property
and resolve to the restored item.
- If the `version` parameter is specified, it should only restore the record if the `version`
  property matches.
- If the `version` property does not match, an `Error` should be thrown with the `concurrency`
  property set to true.
- If the `softDelete` option is not specified on the table configuration, this function
  should have no effect.

## truncate
The truncate function should clear all items from the table and resolve when complete.

## initialize
The initialize function should
- create the columns specified in the `columns` property of the table configuration,
- insert items into the table specified in the `seed` property of the table configuration,
- perform any other table initialization, such as index creation
