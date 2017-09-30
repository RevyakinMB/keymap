var gulp = require('gulp'),
	task = function(options) {
		return function(callback) {
			gulp.watch(options.paths, gulp.parallel('lint', 'build'));
		}
	};

module.exports = task;
