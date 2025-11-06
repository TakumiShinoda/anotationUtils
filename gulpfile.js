const gulp = require('gulp')
const pug = require('gulp-pug')
const electron = require('electron-connect').server.create()
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const plumber = require('gulp-plumber')
const webpackConfig = require('./dev/webpack.config.js')
const {copyChain, routes} = require('./dev/gulpChain.json')

gulp.task('make_bundle', () => {
  return new Promise((mainRes, mainRej) => {
    let tasks = []
    let configBuff

    for(let rt of routes){
      configBuff = webpackConfig.config(rt)

      tasks.push(new Promise((subRes, subRej) => {
        try{
          gulp.src(configBuff.entry)
            .pipe(plumber({errorHandler: function(err) {this.emit('end')}}))
            .pipe(webpackStream(configBuff, webpack))
            .pipe(gulp.dest('./dist/bundles/'))
            .on('error', function (err) {this.emit('end')})
            .on('end', () => {subRes()})
        }catch(err){subRej(err)}
      }))
    }

    Promise.all(tasks)
      .then(() => {mainRes()})
      .catch((err) => {mainRej(err)})
  })
})

gulp.task('pug_compile', () => {
  return new Promise((res) => {
    gulp.src(['./src/**/*.pug', '!./pug/**/_*.pug'])
      .pipe(plumber())
      .pipe(pug({pretty: true}))
      .pipe(gulp.dest('./dist'))
      .on('end', () => { res() })
  })
})

gulp.task('asset_copy', () => {
  return new Promise((mainRes, mainRej) => {
    let tasks = []

    for(let cc of copyChain){
      tasks.push(new Promise((subRes, subRej) => {
        try{
          gulp.src(cc.src, {encoding: false})
            .pipe(gulp.dest(cc.dest))
            .on('end', () => {subRes()})
        }catch(err){subRej(err)}
      }))
    }

    Promise.all(tasks)
      .then(() => {mainRes()})
      .catch((err) => {mainRej(err)})
  })
})

gulp.task('restart', () => {
  return new Promise((res) => {
    electron.restart()
    res()
  })
})

gulp.task('watcher', () => {
  new Promise((res) => {
    gulp.watch(['./src/**', '!./src/app/main.js'], gulp.parallel('pug_compile', 'asset_copy', 'make_bundle'))
    gulp.watch('./src/app/**', gulp.series('restart'))
    electron.start()
    res()
  })
})

gulp.task('start', gulp.series('asset_copy', 'pug_compile', 'make_bundle', 'watcher'))
gulp.task('dist', gulp.parallel('asset_copy', 'pug_compile', 'make_bundle'))