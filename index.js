require('./prototype/array.js');
require('./prototype/date.js');
require('./prototype/string.js');
module.exports.log = require('./log.js');
const sprintfJs = require('sprintf-js');
module.exports.sprintf = sprintfJs.sprintf;
module.exports.vsprintf = sprintfJs.vsprintf;
module.exports.stacktrace = require('stack-trace');
