var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),

	task = function(options) {
		return function() {
			browserSync.init({
				proxy: options.proxy
			});

			gulp.watch([
				options.baseDir + '/app.js',
				options.baseDir + '/**/*.{html,css}'
			]).on('change', browserSync.reload);
		};
	};

module.exports = task;
