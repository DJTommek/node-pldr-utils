
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
