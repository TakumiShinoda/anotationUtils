const gulp = require('gulp')
const pug = require('gulp-pug')
const electron = require('electron-connect').server.create()
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const plumber = require('gulp-plumber')
const fs = require('fs')
const webpackConfig = require('./dev/webpack.config.js')
const {copyChain, routes} = require('./dev/gulpChain.json') 
const {distPath, srcPath} = require('./dev/path')

gulp.task('make_bundle', () => {
  return new Promise((mainRes, mainRej) => {
    let tasks = []

    for(var i = 0; i < routes.length; i++){
      tasks.push(new Promise((subRes, subRej) => {
        try{
          webpackStream(webpackConfig.config(routes[i]), webpack)
            .pipe(plumber())
            .pipe(gulp.dest('./dist/bundles/'))
            .on('error', function (e) { this.emit('end') })
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

    for(var i = 0; i < copyChain.length; i++){
      tasks.push(new Promise((subRes, subRej) => {
        try{
          gulp.src(copyChain[i].src)
            .pipe(gulp.dest(copyChain[i].dest))
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