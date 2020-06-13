/**
 * Return datetime in ISO 8601 with timezone offset instead in UTC
 *
 * @author https://stackoverflow.com/a/17415677/3334403
 * @return {string}
 */
Date.prototype.toISOStringOffset = function (withMiliseconds = false) {
	const timezoneOffsetMinutes = -this.getTimezoneOffset();
	const pad = function (num) {
		const norm = Math.floor(Math.abs(num));
		return (norm < 10 ? '0' : '') + norm;
	};
	let result = '';
	result += this.getFullYear();
	result += '-' + pad(this.getMonth() + 1);
	result += '-' + pad(this.getDate());
	result += 'T' + pad(this.getHours());
	result += ':' + pad(this.getMinutes());
	result += ':' + pad(this.getSeconds());
	if (withMiliseconds === true) {
		result += '.' + (this.getMilliseconds() + '').padStart(3, '0');
	}
	result += (timezoneOffsetMinutes >= 0 ? '+' : '-');
	result += pad(timezoneOffsetMinutes / 60)
	result += ':' + pad(timezoneOffsetMinutes % 60);
	return result;
}

/**
 * Get ISO 8601 date
 *
 * @return {string}
 */
Date.prototype.toISOStringDate = function () {
	return this.toISOStringOffset().slice(0, 10);
}

/**
 * Get ISO 8601 time
 *
 * @param {boolean} offset true for returning with offset, false otherwise
 * @return {string}
 */
Date.prototype.toISOStringTime = function (offset = true) {
	if (offset === true) {
		return this.toISOStringOffset().slice(11);
	} else {
		return this.toISOStringOffset().slice(11, 19);
	}
}