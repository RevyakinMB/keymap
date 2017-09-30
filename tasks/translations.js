var gulp = require('gulp'),
	gettext = require('gulp-angular-gettext'),

	task = function(options) {
		return function() {
			return gulp.src(options.baseDir + '/po/**/*.po')
				.pipe(gettext.compile({
					format: 'json'
				}))
				.pipe(gulp.dest(options.baseDir + '/po/'));
		};
	};

module.exports = task;
