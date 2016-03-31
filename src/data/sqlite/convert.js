var convert = module.exports = {
    value: function (type, value) {
        switch(type) {
            case 'boolean':
                return !!value;
            case 'date':
                return new Date(value);
            default:
                return value;
        }
    },
    item: function (columns, item) {
        return columns.reduce(function (result, column) {
            if(item.hasOwnProperty(column.name))
                result[column.name] = convert.value(column.type, item[column.name]);
            return result;
        }, {});
    }
}
