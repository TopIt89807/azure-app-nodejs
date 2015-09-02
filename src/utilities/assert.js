module.exports = {
    argument: function (value, message) {
        if(value === undefined || value === null)
            throw new Error(message);
    }
}
