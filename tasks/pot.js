var gulp = require('gulp'),
	gettext = require('gulp-angular-gettext'),
	
	task = function(options) {
		return function() {
			return gulp.src([
				options.baseDir + '/**/*.{html,js}',
				'!' + options.baseDir + '/app.js',
				'!' + options.baseDir + '/{libs, po}/**'
			])
				.pipe(gettext.extract('template.pot'))
				.pipe(gulp.dest(options.baseDir + '/po/'));
		};
	};

module.exports = task;

