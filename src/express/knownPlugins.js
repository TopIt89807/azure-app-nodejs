module.exports = function (configuration, logger) {
    return ['azure-mobile-apps-files'].reduce(detectPlugin, []);

    function detectPlugin(plugins, name) {
        try {
            var pluginModule = require(name);
            try {
                plugins.push(pluginModule(configuration, logger));
                logger.info('Loaded plugin ' + name);
            } catch (ex) {
                logger.error('Found plugin ' + name + ' but failed to load: ', ex);
            }
        } catch(ex) {
            // ignore module loading errors, probably means the module has not been installed
        }
        return plugins;
    }
}
