module.exports = function assign() {
    var o,
        prop,
        result = {},
        args = Array.prototype.slice.call(arguments),
        reduceArrays = typeof args[args.length - 1] == 'function' ? args.pop() : undefined;

    while (o = args.shift()) {
        for (prop in o) {
            if (!o.hasOwnProperty(prop))
                continue;

            if (typeof o[prop] == 'object' && typeOf(o[prop]) == 'object')
                result[prop] = assign(result[prop] || {}, o[prop], reduceArrays);

            else if (reduceArrays && typeOf(o[prop]) == 'array')
                result[prop] = reduceArrays(result[prop] || [], Array.prototype.slice.call(o[prop]));
            else
                result[prop] = o[prop];
        }
    }

    return result;
};

function typeOf(obj) {
    return Object.prototype.toString.call(obj).match(/\[object\s*([^\]]+)\]/)[1].toLowerCase();
}
