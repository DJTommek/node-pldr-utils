/**
 * Return datetime in ISO 8601 with timezone offset instead in UTC
 *
 * @author https://stackoverflow.com/a/17415677/3334403
 * @return {string}
 */
Date.prototype.toISOStringOffset = function () {
	const tzo = -this.getTimezoneOffset();
	const dif = tzo >= 0 ? '+' : '-';
	const pad = function (num) {
		const norm = Math.floor(Math.abs(num));
		return (norm < 10 ? '0' : '') + norm;
	};
	return this.getFullYear() +
		'-' + pad(this.getMonth() + 1) +
		'-' + pad(this.getDate()) +
		'T' + pad(this.getHours()) +
		':' + pad(this.getMinutes()) +
		':' + pad(this.getSeconds()) +
		dif + pad(tzo / 60) +
		':' + pad(tzo % 60);
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