const gulp = require('gulp')
const browserSync = require('browser-sync').create()
/*---------> Postcss Plugins <------------*/
const postcss = require('gulp-postcss')
const cssnext = require('postcss-cssnext')
const responsive = require('postcss-responsive-type')
const csswring = require('csswring')
const atImport = require('postcss-import')
const mixins = require('postcss-mixins')
const mqpacker = require('css-mqpacker')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
/*----------> Javascript Build <------------*/
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const watchify = require('watchify')
const babelify = require('babelify')
const presets2015 = require('babel-preset-es2015')

/*Browser Sync task server*/
gulp.task('server', () => {
    browserSync.init({
        server: {
            baseDir: './dist/',
        },
        open:false
    })
})


/*Postcss task build*/
gulp.task('css', () => {
  let processors = [atImport(),mixins,responsive,cssnext,mqpacker,csswring({removeAllComments:true})]

  return gulp.src('./src/css/index.css')
          .pipe(sourcemaps.init())
              .pipe(postcss(processors))
          .pipe(sourcemaps.write('.'))
          .pipe(rename('styles.css'))
          .pipe(gulp.dest('./dist'))

})


/*-----------------------------Build Function and task----------------------------------------------------*/

function build(watch) {
  let opts = {
    entries: ['./src/js/index.js']
  }

    let build = watchify(browserify(opts))
  
  return new Promise( (resolve, reject) => {

    function compile () {
      return new Promise((resolve,reject) => {
        build
          .transform('babelify', {presets : ['es2015']})
          .bundle()
          .on('error', (err) => {
              if(err){
                return reject(err)
              }
            })
          .pipe(source('index.js'))
          .pipe(rename('build.js'))
          .pipe(gulp.dest('./dist'))

        resolve('Success...!')
      }) 
    }

  if(watch){
      return compile()
              .then( result => {
                console.log(`---------> Compile Status : ${result} <--------------`)
              })
              .catch( err => console.log(`---------> Compile Status : ${err} <--------------`))
    }

  })
}

/*Javascrip build task*/
gulp.task('build', () => {
  gulp.watch('./src/js/index.js').on('change',() => {
    build(true).then(result => console.log("working")).catch( err => console.log("epic error.... lol !!!"))
  })
})

/*-------------------------------------------------------------------------------------------------------*/

/*Watch changes on html and css*/
gulp.task('watcher', () => {
  gulp.watch('./dist/index.html').on('change', browserSync.reload)
  gulp.watch('./src/css/index.css', ['css']).on('change', browserSync.reload)
  gulp.watch('./src/js/index.js').on('change',() => {
    build(true)
    browserSync.reload()
  })
})


/*Default task*/
gulp.task('default', ['server', 'watcher'])

