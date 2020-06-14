# node-pldr-utils
Bunch of useful utils or modules which I'm personally using in (almost) all my projects.

# Modules

## Logger

Custom designed logger in JSON format. 

### Features
- easy readable in both console and by machine (JSON)
- supporting colors 
- optional global error and exception catching
- pre-created logger "severity":
    - debug, info, warning, error, fatal error (immediately kill app)
    - webserver, sql
- all parameters (which file, if console, color etc.) can be dynamically changed

### Usage

#### log.js
```js
module.exports = require('node-pldr-utils').log.init({
	path: __dirname + '/../../data/log/',
	catchGlobalExceptions: true,
});
```
#### index.js
```js
const LOG = require('./log.js');
LOG.info('Hello world!');
// => {"datetime":"2020-06-14T16:03:10.794+02:00","severity":"info","content":"Hello world!"}
```