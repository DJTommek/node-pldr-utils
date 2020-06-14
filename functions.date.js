/**
 * Return datetime in ISO 8601 with timezone offset instead in UTC
 *
 * @author https://stackoverflow.com/a/17415677/3334403
 * @return {string}
 */
Date.prototype.toISOStringLocale = function (milliseconds = false) {
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
	if (milliseconds === true) {
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
Date.prototype.toISOStringLocaleDate = function () {
	return this.toISOStringLocale().slice(0, 10);
}

/**
 * Get ISO 8601 time
 *
 * @param {boolean} milliseconds
 * @param {boolean} offset true for returning with offset, false otherwise
 * @return {string}
 */
Date.prototype.toISOStringLocaleTime = function (milliseconds = false, offset = true) {
	const time = this.toISOStringLocale(milliseconds).slice(11)
	if (offset === true) {
		return time;
	} else {
		return time.slice(0, -6);
	}
}

// @TODO Tests
// const a = new Date();

// a.toISOStringLocale(false);
// a.toISOStringLocale(true);

// a.toISOStringLocaleDate(false);
// a.toISOStringLocaleDate(true);

// a.toISOStringLocaleTime(false, false);
// a.toISOStringLocaleTime(false, true);
// a.toISOStringLocaleTime(true, false);
// a.toISOStringLocaleTime(true, true);


