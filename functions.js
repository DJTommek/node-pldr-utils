Date.prototype.human = function (returnObject) {
	const res = {
		milisecond: (this.getMilliseconds() + '').padStart(3, '0') + '',
		second: (this.getSeconds() + '').padStart(2, '0') + '',
		minute: (this.getMinutes() + '').padStart(2, '0') + '',
		hour: (this.getHours() + '').padStart(2, '0') + '',
		day: (this.getDate() + '').padStart(2, '0') + '',
		month: (this.getMonth() + 1 + '').padStart(2, '0') + '',
		year: (this.getFullYear() + '').padStart(2, '0') + ''
	}
	res.date = res.year + '.' + res.month + '.' + res.day;
	res.time = res.hour + ':' + res.minute + ':' + res.second;
	res.toString = function () {
		return (res.date + ' ' + res.time + '.' + res.milisecond);
	}
	if (returnObject === true) {
		return res;
	} else {
		return res + '';
	}
}

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
