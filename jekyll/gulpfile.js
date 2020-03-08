var gulp = require('gulp'),
  settings = require('./settings'),
  webpack = require('webpack'),
  browserSync = require('browser-sync').create(),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  nested = require('postcss-nested'),
  cssImport = require('postcss-import'),
  postcssCustomProperties = require('postcss-custom-properties');

gulp.task('styles', function() {
  return gulp
    .src(settings.projectRoot + 'css/style.css')
    .pipe(
      postcss([
        cssImport,
        nested,
        postcssCustomProperties({
          preserve: true,
          importFrom: './css/properties.css',
        }),
        autoprefixer,
      ]),
    )
    .on('error', error => console.log(error.toString()))
    .pipe(gulp.dest(settings.projectRoot));
});

gulp.task('scripts', function(callback) {
  webpack(require('./webpack.config.js'), function(err, stats) {
    if (err) {
      console.log(err.toString());
    }

    console.log(stats.toString());
    callback();
  });
});

gulp.task('watch', function() {
  browserSync.init({
    notify: true,
    proxy: settings.urlToPreview,
    ghostMode: false,
  });

  gulp.watch(
    settings.projectRoot + 'css/**/*.css',
    gulp.parallel('waitForStyles'),
  );
  gulp.watch(
    [
      settings.projectRoot + 'js/modules/*.js',
      settings.projectRoot + 'js/scripts.js',
    ],
    gulp.parallel('waitForScripts'),
  );
});

gulp.task(
  'waitForStyles',
  gulp.series('styles', function() {
    return gulp
      .src(settings.projectRoot + 'style.css')
      .pipe(browserSync.stream());
  }),
);

gulp.task(
  'waitForScripts',
  gulp.series('scripts', function(cb) {
    browserSync.reload();
    cb();
  }),
);
