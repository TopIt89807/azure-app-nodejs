module.exports = function (type, value) {
    switch(type) {
        case 'boolean':
            return !!value;
        case 'date':
            return new Date(value);
        default:
            return value;
    }
}
