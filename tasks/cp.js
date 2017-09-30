let gulp = require('gulp');

module.exports = function(options) {
	return function(callback) {
		return gulp.src(options.src, { base: options.base })
			.pipe(gulp.dest(options.dest));
	};
};
