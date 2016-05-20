module.exports = function (configuration) {
    return ['azure-mobile-apps-files'].reduce(detectPlugin, []);

    function detectPlugin(plugins, name) {
        try {
            plugins.push(require(name));
        } catch(ex) { }
        return plugins;
    }
}
