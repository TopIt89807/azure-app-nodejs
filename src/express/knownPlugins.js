module.exports = function (configuration, logger) {
    return ['azure-mobile-apps-files'].reduce(detectPlugin, []);

    function detectPlugin(plugins, name) {
        try {
            plugins.push(require(name)(configuration, logger));
            logger.info('Loaded plugin ' + name);
        } catch(ex) { }
        return plugins;
    }
}
