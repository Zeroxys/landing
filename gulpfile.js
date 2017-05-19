const gulp = require('gulp')
const postcss = require('gulp-postcss')
const cssnext = require('postcss-cssnext')
const responsive = require('postcss-responsive-type')
const csswring = require('csswring')
const atImport = require('postcss-import')
const mixins = require('postcss-mixins')
const mqpacker = require('css-mqpacker')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()

gulp.task('server', () => {
    browserSync.init({
        server: {
            baseDir: './dist/',
        },
        open:false
    })
})

gulp.task('css', () => {
  let processors = [atImport(),mixins,responsive,cssnext,mqpacker,csswring({removeAllComments:true})]

  return gulp.src('./src/css/index.css')
          .pipe(sourcemaps.init())
              .pipe(postcss(processors))
          .pipe(sourcemaps.write('.'))
          .pipe(rename('styles.css'))
          .pipe(gulp.dest('./dist'))

})

gulp.task('watcher', () => {
  gulp.watch('./dist/index.html').on('change', browserSync.reload)
  gulp.watch('./src/css/index.css', ['css']).on('change', browserSync.reload)
})

gulp.task('default', ['server', 'watcher'])

