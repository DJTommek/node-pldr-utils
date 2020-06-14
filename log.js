const FS = require('fs');
const PATH = require('path');
const sprintf = require('sprintf-js').sprintf;

const STACKTRACE = require('stack-trace');
const COLOR_RESET = '\x1b[0m';
const COLOR_RED = '\x1b[31m';
const COLOR_YELLOW = '\x1b[33m';

module.exports.DEBUG = 'debug';
module.exports.INFO = 'info';
module.exports.WARNING = 'warning';
module.exports.ERROR = 'error';
module.exports.FATAL_ERROR = 'fatal error';

module.exports.MSG = 'message';
module.exports.WEBSERVER = 'webserver';
module.exports.SQL = 'sql';

module.exports.UNCAUGHT_EXCEPTION = 'uncaught exception';

let PARAMS = {
	fileExtension: 'log',
	catchGlobalExceptions: false,
	logsPath: null,
}

/**
 * Set logging parameters
 *
 * @param {{}} params
 * @returns {self}
 */
module.exports.init = function (params = {}) {
	// Required parameter "path"
	if (typeof params.path !== 'string' || PATH.isAbsolute(PATH.join(params.path)) === false) {
		throw new TypeError('Base folder where to save logs has to be absolute path.');
	}
	PARAMS.logsPath = PATH.join(params.path);

	// Optional parameter "fileExtension"
	if (typeof params.fileExtension !== 'undefined') {
		if (typeof params.fileExtension !== 'string' || !params.fileExtension.match(/^[a-zA-Z0-9]{1,10}$/)) {
			throw new TypeError('Optional parameter "fileExtension" has to be short string. Default = \'' + PARAMS.fileExtension + '\'');
		}
		PARAMS.fileExtension = params.fileExtension;
	}

	// Optional parameter "catchGlobalExceptions"
	if (typeof params.catchGlobalExceptions !== 'undefined') {
		if (typeof params.catchGlobalExceptions !== "boolean") {
			throw new TypeError('Optional parameter "catchGlobalExceptions" has to be boolean. Default = ' + (PARAMS.catchGlobalExceptions ? 'true' : 'false'));
		}
		PARAMS.catchGlobalExceptions = params.catchGlobalExceptions;
	}
	checkAndCreateFolders();
	if (PARAMS.catchGlobalExceptions === true) {
		process.on('uncaughtException', function (error) {
			try {
				module.exports.log({
					name: error.name,
					message: error.message,
					stack: STACKTRACE.parse(error),
				}, module.exports.UNCAUGHT_EXCEPTION);
			} catch (error) {
				console.error('(Log) Error while catching "uncaughtException": ' + error.message + ' [This message is not saved]');
			}
		});
	}
	return this;
};

const baseLogFileFormat = '%(date)s';
const fileExtension = 'log';
const defaultLogData = {
	fileFormat: '%(date)s',
	toMainLog: true,
	console: true,
	quit: false,
	color: '',
};

const logsData = {
	[this.INFO]: {},
	[this.WARNING]: {
		fileFormat: '%(date)s_warning',
		color: COLOR_YELLOW,
	},
	[this.ERROR]: {
		fileFormat: '%(date)s_error',
		color: COLOR_RED,
	},
	[this.FATAL_ERROR]: {
		fileFormat: '%(date)s_error',
		color: COLOR_RED,
		quit: true,
	},
	[this.UNCAUGHT_EXCEPTION]: {
		fileFormat: '%(date)s_exception',
		color: COLOR_RED,
	},
	[this.MSG]: {
		fileFormat: 'messages/message_%(date)s',
		mainLog: false,
		console: false,
	},
	[this.WEBSERVER]: {
		fileFormat: 'webserver/webserver_%(date)s',
		mainLog: false,
		console: false,
	},
	[this.SQL]: {
		fileFormat: 'sql/sql_%(date)s',
		mainLog: false,
		console: false,
	},
	[this.DEBUG]: {
		fileFormat: '%(date)s_debug',
		mainLog: false,
	},
};

/*
 * Shortcuts
 */
module.exports.info = function (msg, parameters) {
	this.log(msg, this.INFO, parameters);
};
module.exports.error = function (msg, parameters) {
	this.log(msg, this.ERROR, parameters);
};
module.exports.msg = function (msg, parameters) {
	this.log(msg, this.MSG, parameters);
};
module.exports.debug = function (msg, parameters) {
	this.log(msg, this.DEBUG, parameters);
};
module.exports.webserver = function (msg, parameters) {
	this.log(msg, this.WEBSERVER, parameters);
};
module.exports.sql = function (msg, parameters) {
	this.log(msg, this.SQL, parameters);
};
module.exports.fatal = function (msg, parameters) {
	this.log(msg, this.FATAL_ERROR, parameters);
};
module.exports.warning = function (msg, parameters) {
	this.log(msg, this.WARNING, parameters);
};

/**
 * Get full LogParams.
 * - get default values
 * - overwrite with values set by specific severity (if any)
 * - overwrite with values set externally (if any)
 *
 * @param {string} severity
 * @param {{}} [customParams]
 * @returns {{}}
 */
function defineLogParameters(severity, customParams) {
	// do not override default object, create new instead and merge new parameters
	let logParams = Object.assign({}, defaultLogData, logsData[severity]);
	logParams['severity'] = severity;

	// override pre-defined settings with custom parameters
	if (customParams) {
		Object.assign(logParams, customParams);
	}
	return logParams;
}

/**
 * Log to console and/or file
 *
 * @param message
 * @param {string} severity
 * @param {{}} [params]
 */
module.exports.log = function (message, severity, params) {
	if (PARAMS.logsPath === null) {
		throw new Error('Base folder where to save logs has to be absolute path. Run init({path: "/some/absolute/path/"}) first.');
	}
	if (typeof severity === 'undefined') {
		// set default severity if not set
		severity = module.exports.INFO;
	}

	const logParams = defineLogParameters(severity, params);
	const now = new Date();
	const content = JSON.stringify({
		datetime: now.toISOStringLocale(true),
		severity: severity,
		content: message,
	});

	// Show log in console
	if (logParams.console) {
		console.log(logParams.color + content + COLOR_RESET);
	}
	// Log into mainlog file
	if (logParams.toMainLog) {
		FS.appendFileSync(PARAMS.logsPath + sprintf(baseLogFileFormat, {'date': now.toISOStringLocaleDate()}) + '.' + fileExtension, content + '\n', 'utf8');
	}
	// Log into separated log file if requested
	try {
		if (logParams.fileFormat) {
			const file = PARAMS.logsPath + sprintf(logParams.fileFormat, {'date': now.toISOStringLocaleDate()}) + '.' + fileExtension;
			FS.appendFileSync(file, content + '\n', 'utf8');
		}
	} catch (error) {
		const content = JSON.stringify({
			datetime: now.toISOStringLocale(true),
			severity: module.exports.ERROR,
			content: {
				info: 'This message is not saved',
				name: error.name,
				message: error.message,
				stack: STACKTRACE.parse(error),
			}
		});
		console.error(COLOR_RED + content + COLOR_RESET);
	}
	// Exit application if necessary
	if (logParams.quit === true) {
		process.kill(process.pid, 'SIGINT');
	}
};

module.exports.head = function (text, type, params) {
	this.log('***' + text + '***', type, params);
};

/**
 * Get all files, which could be created
 *
 * @param {Date} [date]
 * @returns {[]}
 */
function getAllFiles(date) {
	if (!(date instanceof Date)) {
		date = new Date();
	}
	const files = [];
	for (let severity in logsData) {
		const logParameters = defineLogParameters(severity);
		files.push(PARAMS.logsPath + sprintf(logParameters.fileFormat, {'date': date.toISOStringLocaleDate()}) + '.' + fileExtension);
	}
	return files;
}

/**
 * Get all folders, which should be created to Log work properly
 *
 * @param [date]
 * @returns {[]}
 */
function getAllFolders(date) {
	const allFiles = getAllFiles(date);
	const folders = [];
	allFiles.forEach(function (file) {
		folders.pushUnique(PATH.dirname(file));
	});
	return folders;
}

/**
 * Check if all necessary folders are created. If not, create them
 */
function checkAndCreateFolders() {
	const folders = getAllFolders();

	for (const folder of folders) {
		try {
			if (!FS.existsSync(folder)) {
				FS.mkdirSync(folder, {recursive: true});
				console.log('(Log) Folder "' + folder + '" was missing - created new. [This message is not saved]');
			}
		} catch (error) {
			throw new Error('Error while creating folders to log: ' + error.message + ' [This message is not saved]');
		}
	}
}
