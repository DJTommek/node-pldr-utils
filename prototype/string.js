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
