var convert = module.exports = {
    value: function (type, value) {
        switch(type) {
            case 'boolean':
                if(value === undefined || value === null)
                    return value;
                return !!value;
            case 'date':
            if(value === undefined || value === null)
                return value;
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
