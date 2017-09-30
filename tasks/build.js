var gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),

	task = function(options) {
		return function(callback) {
			return gulp.src(options.paths)
				.pipe($.if(!options.production, $.plumber({
					errorHandler: $.notify.onError(function(err) {
						return {
							title: 'build',
							message: err.message
						};
					})
				})))
				.pipe($.concat('app.js'))
				.pipe($.ngAnnotate())
				.pipe(gulp.dest(options.baseDir));
		};
	};

module.exports = task;

