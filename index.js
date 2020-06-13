const LOG = require('./log.js').setup({path: __dirname + '/'});


LOG.log('default log');

LOG.debug('debug log');
LOG.info('info log');
LOG.warning('warning log');
LOG.error('error log');
LOG.msg('msg log');
LOG.webserver('webserver log');
LOG.sql('webserver log');
// LOG.fatal('webserver log');
