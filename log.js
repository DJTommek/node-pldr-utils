const FS = require('fs');
const PATH = require('path');
require('./functions.js');
require('./functions.date.js');

console.log(new Date().toISOString());
console.log(new Date().toISOStringOffset());

module.exports.INFO = 0;
module.exports.ERROR = 1;
module.exports.MSG = 2;
module.exports.DEBUG = 3;
module.exports.WEBSERVER = 4;
module.exports.SQL = 5;
module.exports.FATAL_ERROR = 6;
module.exports.UNCAUGHT_EXCEPTION = 7;
module.exports.WARNING = 8;

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
module.exports.setup = function (params = {}) {
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
				module.exports.log(error.message + ' - more in exception log.', module.exports.ERROR);
				module.exports.log(error.stack, module.exports.UNCAUGHT_EXCEPTION);
			} catch (error) {
				console.error('(Log) Error while catching "uncaughtException": ' + error.message + ' [This message is not saved]');
			}
		});
	}
	return this;
};

const baseLogFileFormat = '{date}';
const fileExtension = 'log';
const defaultLogData = {
	fileFormat: '{date}',
	messageFormat: '{message}',
	messageSuffix: '',
	toMainLog: true,
	console: true,
	quit: false,
	color: '',
};

const logsData = {
	[this.INFO]: {},
	[this.WARNING]: {
		fileFormat: '{date}_warning',
		color: '\x1b[33m', // yellow
	},
	[this.ERROR]: {
		fileFormat: '{date}_error',
		color: '\x1b[31m', // red
	},
	[this.FATAL_ERROR]: {
		fileFormat: '{date}_error',
		messageFormat: '[FATAL ERROR] {message}',
		color: '\x1b[31m', // red
		quit: true,
	},
	[this.UNCAUGHT_EXCEPTION]: {
		fileFormat: '{date}_exception',
		messageFormat: '[UNCAUGHT EXCEPTION] {message}',
		color: '\x1b[31m', // red
	},
	[this.MSG]: {
		fileFormat: 'messages/message_{date}',
		mainLog: false,
		console: false,
	},
	[this.WEBSERVER]: {
		fileFormat: 'webserver/webserver_{date}',
		mainLog: false,
		console: false,
	},
	[this.SQL]: {
		fileFormat: 'sql/sql_{date}',
		mainLog: false,
		console: false,
	},
	[this.DEBUG]: {
		fileFormat: '{date}_debug',
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
 * @param {number} severity
 * @param {{}} [customParams]
 * @returns {{}}
 */
function defineLogParameters(severity, customParams) {
	if (typeof severity === 'undefined') {
		// set default severity if not set
		severity = module.exports.INFO;
	}
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
 * @param {number} severity
 * @param {{}} [params]
 */
module.exports.log = function (message, severity, params) {
	if (PARAMS.logsPath === null) {
		throw new Error('Base folder where to save logs has to be absolute path. Run setup({path: "/some/absolute/path/"}) first.');
	}

	const logParams = defineLogParameters(severity, params);
	const now = new Date();
	const contentJson = {
		datetime: now.toISOStringOffset(),
		content: logParams.messageFormat.formatUnicorn({'message': message}),
	}
	const content = JSON.stringify(contentJson);

	// Show log in console
	if (logParams.console) {
		console.log(logParams.color + content + '\x1b[0m');
	}
	// Log into mainlog file
	if (logParams.toMainLog) {
		FS.appendFileSync(PARAMS.logsPath + baseLogFileFormat.formatUnicorn({'date': now.toISOStringDate()}) + '.' + fileExtension, content + '\n', 'utf8');
	}
	// Log into separated log file if requested
	try {
		if (logParams.fileFormat) {
			const file = PARAMS.logsPath + logParams.fileFormat.formatUnicorn({'date': now.toISOStringDate()}) + '.' + fileExtension;
			FS.appendFileSync(file, content + '\n', 'utf8');
		}
	} catch (error) {
		console.error('Cant log into separate log: [This message is not saved]');
		console.error(error);
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
		severity = parseInt(severity); // numeric indexes are converted to string so it needs to be re-converted back to number
		const logParameters = defineLogParameters(severity);
		files.push(PARAMS.logsPath + logParameters.fileFormat.formatUnicorn({'date': date.toISOStringDate()}) + '.' + fileExtension);
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
			throw new Error('(Log) Error while creating folders to log: ' + error.message + ' [This message is not saved]');
		}
	}
}
