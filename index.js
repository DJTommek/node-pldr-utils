const LOG = require('./log.js').init({
	path: __dirname + '/data/',
	catchGlobalExceptions: true,
});


LOG.log('default log', {console: true});

LOG.debug('debug log', {console: true});
LOG.info('info log', {console: true});
LOG.warning('warning log', {console: true});
LOG.error('error log', {console: true});
LOG.msg('message log', {console: true});
(function () {
	throw new Error('fdsaffa');
})();

LOG.webserver('webserver log', {console: true});
LOG.sql('sql log', {console: true});
LOG.fatal('webserver log');

