'use strict';

var gulp = require('gulp');
var bs = require('browser-sync').create(); // create a browser sync instance.
var proxyMiddleware = require('http-proxy-middleware');
var sass = require('gulp-sass');
var inject = require('gulp-inject');

var apiserver = proxyMiddleware('/BusinessTrendAPI/Service1.svc', {
    //target: 'http://10.10.0.18:80/',
    //target: 'http://hrms.onestalove.com/',
    target: 'http://insights.bnhl.in/',
    changeOrigin: true,             // for vhosted sites, changes host header to match to target's host
    logLevel: 'debug'
});


gulp.task('serve', function() {
    bs.init({
        server: {
            baseDir: "./app"
        },
        middleware: [apiserver],
        browser: 'default',
        ghostMode: false
    });
    gulp.watch("app/*/*.html").on('change', bs.reload);
    gulp.watch('app/*.js', function(){
        return gulp.src('app/*.js').pipe(bs.stream());
    });
    gulp.watch("app/assets/scss/*.scss", function(){
        return gulp.src('app/assets/scss/*.scss')
            .pipe(sass())
            .pipe(gulp.dest('app/assets/css'))
            .pipe(bs.reload({stream: true})); // prompts a reload after compilation
    });

});

gulp.task('release', function () {
    var target = gulp.src('app/index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(['app/app.js', 'app/app.controller.js', 'app/app.oc_lazy_load.js',
    "app/assets/css/main.css", "app/assets/css/responsive.css"], {read: false});


    return target.pipe(inject(sources, {
        relative : true,
        addSuffix: "?v=" + Math.random()
    })).pipe(gulp.dest('app'));
});

