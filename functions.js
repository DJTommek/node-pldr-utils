/**
 * Replace all elements in string
 *
 * @param search
 * @param replacement
 * @returns {string}
 */
String.prototype.replaceAll = function (search, replacement) {
	return this.split(search).join(replacement);
};

/**
 * Format string based on parameters
 *
 * @example "a{0}bcd{1}ef".formatUnicorn("FOO", "BAR"); // "aFOObcdBARef"
 * @example "a{first}bcd{second}ef{first}".formatUnicorn({first: "FOO", second: "BAR"}); // "aFOObcdBARefFOO"
 * @author https://stackoverflow.com/a/18234317/3334403
 * @returns {string}
 */
String.prototype.formatUnicorn = function () {
	"use strict";
	let str = this.toString();
	if (arguments.length) {
		const t = typeof arguments[0];
		const args = ("string" === t || "number" === t) ? Array.prototype.slice.call(arguments) : arguments[0];
		for (let key in args) {
			str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
		}
	}

	return str;
};

/**
 * Escape regex chars to use it safely in regex as string
 *
 * @see https://locutus.io/php/pcre/preg_quote/
 * @see https://stackoverflow.com/a/280805/3334403
 * @returns {String}
 */
String.prototype.preg_quote = String.prototype.preg_quote || function () {
	return this.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:-]', 'g'), '\\$&');
};

/**
 * Escape HTML tags
 *
 * @author https://stackoverflow.com/a/6234804/3334403
 */
String.prototype.escapeHtml = String.prototype.escapeHtml || function () {
	return this
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
};

/**
 * Return last element of array without updating array itself
 *
 * @param {Number} [last] which index from last element
 * @return {*|undefined} last element of array or undefined
 */
Array.prototype.last = function (last) {
	if (last === undefined) {
		last = 1;
	} else if (typeof last !== 'number' || last < 1) {
		throw new Error('Parameter "last" has to be positive number.')
	}
	return this[this.length - last];
};

/**
 * Return true if value is in array
 *
 * @param element
 * @returns {boolean}
 */
Array.prototype.inArray = function (element) {
	return (this.indexOf(element) >= 0)
};

/**
 * Remove all item(s) from array by value
 *
 * @param value
 * @returns {Array}
 */
Array.prototype.removeByValue = function (value) {
	while (true) {
		let index = this.indexOf(value);
		if (index === -1) {
			break
		}
		this.splice(index, 1);
	}
	return this;
};

/**
 * Push into array only if not already in it
 *
 * @param item
 * @returns {Array}
 */
Array.prototype.pushUnique = function (item) {
	if (this.inArray(item) === false) {
		this.push(item);
	}
	return this;
};

/**
 * Convert the result of process.hrtime() to milliseconds
 *
 * @author https://github.com/sindresorhus/convert-hrtime
 * @param hrtime
 * @return {number}
 */
function hrtime(hrtime) {
	const nanoseconds = (hrtime[0] * 1e9) + hrtime[1];
	return nanoseconds / 1e6;
}

global.hrtime = hrtime;

/**
 * Check, if value can be converted to number
 *
 * @param {*} numeric
 * @returns {boolean}
 */
function isNumeric(numeric) {
	if (Array.isArray(numeric)) {
		return false;
	}
	return !isNaN(parseFloat(numeric)) && isFinite(numeric);
}

global.isNumeric = isNumeric;

/**
 * Format miliseconds to human redable string, 10d 2h 52m 684ms
 *
 * @param {int} miliseconds
 * @returns {String}
 */
global.msToHuman = msToHuman;

function msToHuman(miliseconds) {
	if (typeof miliseconds !== 'number' || miliseconds < 0) {
		throw new Error('Parameter "miliseconds" has to be positive number.');
	}
	if (miliseconds === 0) {
		return '0ms';
	}
	const milliseconds = Math.floor((miliseconds) % 1000);
	const seconds = Math.floor((miliseconds / (1000)) % 60);
	const minutes = Math.floor((miliseconds / (1000 * 60)) % 60);
	const hours = Math.floor((miliseconds / (1000 * 60 * 60)) % 24);
	const days = Math.floor((miliseconds / (1000 * 60 * 60 * 24)));

	let result = '';
	result += (days > 0 ? ' ' + days + 'd' : '');
	result += (hours > 0 ? ' ' + hours + 'h' : '');
	result += (minutes > 0 ? ' ' + minutes + 'm' : '');
	result += (seconds > 0 ? ' ' + seconds + 's' : '');
	result += (milliseconds > 0 ? ' ' + milliseconds + 'ms' : '');
	return result.trim();
}

/**
 * Format human readable duration string back to miliseconds
 *
 * @TODO throw error if input string is not valid human readable duration
 * @param {string} human readable duration
 * @returns {String}
 */
global.humanToMs = humanToMs;

function humanToMs(human) {
	if (typeof human !== 'string') {
		throw new Error('Parameter "human" has to be string.');
	}
	let result = 0;
	[
		[/([0-9]+)d/, 1000 * 60 * 60 * 24],
		[/([0-9]+)h/, 1000 * 60 * 60],
		[/([0-9]+)m([^s]|$)/, 1000 * 60],
		[/([0-9]+)s/, 1000],
		[/([0-9]+)ms/, 1]
	].forEach(function (timeData) {
		const timeValue = timeData[0].exec(human);
		if (timeValue) {
			result += timeValue[1] * timeData[1];
		}
	});
	return result;
}

/**
 * Round number with supporting floating point
 *
 * @param number
 * @param points How many numbers behind floating point
 * @returns {number}
 */
function numberRound(number, points) {
	let precision = parseInt('1'.pad((points + 1), '0'));
	return Math.round(number * precision) / precision;
}
