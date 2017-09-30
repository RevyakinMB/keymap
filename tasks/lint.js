var gulp = require('gulp'),
	fs = require('fs'),
	eslint = require('gulp-eslint'),
	notify = require('gulp-notify'),
	_if = require('gulp-if'),
	combine = require('stream-combiner2').obj,
	through2 = require('through2').obj,
	task;

task = function(options) {
	return function(done) {
		var cacheFilePath = process.cwd() + '/lintCache.json',
			lintResults = {},
			rcUpdated = false,
			rcMtime = 0,
			ready = false,
			doLint;

		fs.readFile(cacheFilePath, function(err, data) {
			if (!err) {
				try {
					lintResults = JSON.parse(data);
				} catch (e) {
					console.log('Error while parsing cache file:', e);
				}
			}
			ready ? doLint() : ready = true;
		});

		fs.stat(options.eslintConfPath, function(err, stats) {
			if (!err) {
				rcMtime = stats.mtime;
			}
			ready ? doLint() : ready = true;
		});

		doLint = function() {
			rcUpdated = lintResults['esConf'] &&
				rcMtime &&
				lintResults['esConf'] !== rcMtime.toJSON();
			gulp.src([
				options.baseDir + '/**/*.js',
				'!' + options.baseDir + '/**/*.spec.js',
				'!' + options.baseDir + '/app.js',
				'!' + options.baseDir + '/libs/**',
				'!' + options.baseDir + '/po/**'
			], {
				read: false
			})
			.pipe(
				_if(function(file) {
					if (!lintResults[file.path]) {
						return false;
					}
					return !rcUpdated &&
					   	lintResults[file.path].mtime === file.stat.mtime.toJSON();
				},
				through2(function(file, enc, callback) {
					file.eslint = lintResults[file.path].eslint;
					callback(undefined, file);
				}),
				combine(
					through2(function(file, enc, callback) {
						fs.readFile(file.path, function(err, data) {
							if (err) {
								callback(err);
							}
							file.contents = data;
							callback(undefined, file);
						});
					}),
					eslint(),
					through2(function(file, enc, callback) {
						lintResults[file.path] = {
							eslint: file.eslint,
							mtime: file.stat.mtime
						};
						callback(undefined, file);
					})
				)
			))
			.pipe(eslint.format())
			.pipe(eslint.failAfterError())
			.on('error', notify.onError({
				title: 'Gulp: lint error'
			}))
			.pipe(through2(function(file, enc, cb) {
					cb(undefined, file);
				}, function(cb) {
					if (rcMtime) {
						lintResults['esConf'] = rcMtime;
					}
					fs.writeFile(
						cacheFilePath,
						JSON.stringify(lintResults),
						function(err) {
							if (err) {
								console.warn('Error while saving lintCache file:', err);
							}
							cb();
						}
					);
				})
			)
			.resume()
			.on('finish', done);
		};
	};
};

module.exports = task;
