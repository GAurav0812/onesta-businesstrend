'use strict';

var gulp = require('gulp');
var bs = require('browser-sync').create(); // create a browser sync instance.
var proxyMiddleware = require('http-proxy-middleware');
var sass = require('gulp-sass');
var inject = require('gulp-inject');
var rev = require('gulp-rev');
var filter = require('gulp-filter');
var revReplace = require('gulp-rev-replace');
var del = require("del");
var extend = require("gulp-extend");
var uglify = require("gulp-uglify-es").default;
var htmlmin = require("gulp-minify-html");
var angularTemplatecache = require("gulp-angular-templatecache");

var apiserver = proxyMiddleware('/BusinessTrendAPI/Service1.svc', {
    //target: 'http://10.10.0.18:80/',
    target: 'http://hrms.onestalove.com/',
    changeOrigin: true,             // for vhosted sites, changes host header to match to target's host
    logLevel: 'debug'
});


gulp.task('serve', function () {
    bs.init({
        server: {
            baseDir: "./app"
        },
        middleware: [apiserver],
        browser: 'default',
        ghostMode: false
    });
    gulp.watch("app/*/*.html").on('change', bs.reload);
    gulp.watch('app/*.js', function () {
        return gulp.src('app/*.js').pipe(bs.stream());
    });
    gulp.watch("app/assets/scss/*.scss", function () {
        return gulp.src('app/assets/scss/*.scss')
            .pipe(sass())
            .pipe(gulp.dest('app/assets/css'))
            .pipe(bs.reload({stream: true})); // prompts a reload after compilation
    });

});
gulp.task('clean', function(){
    return del(['dist','.tmp'], {force:true});
});


gulp.task('partials', function ()
{
    return gulp.src([
            'app/sh*/*.html',
            'app/vi*/**/*.html',
        ])
        .pipe(htmlmin({
            collapseWhitespace: true,
            maxLineLength     : 120,
            removeComments    : true
        }))
        .pipe(angularTemplatecache('templateCacheHtml.js', {
            module: 'able'
        }))
        .pipe(gulp.dest('.tmp/partials/'));
});

gulp.task('inject', ['partials'], function () {

	var partialsInjectFile = gulp.src('.tmp/partials/templateCacheHtml.js', {read: false});
    var partialsInjectOptions = {
        starttag    : '<!-- inject:partials -->',
        ignorePath  : '.tmp/partials',
        addRootSlash: false
    };
	 
	return gulp.src("app/index.html")
	.pipe(inject(partialsInjectFile, partialsInjectOptions))
	.pipe(gulp.dest('app'))
});




gulp.task('dist:css',  function () {
		var cssSrc = ["app/assets/css/main.css", "app/assets/css/responsive.css", "app/assets/css/menu.css"];
    return gulp.src(cssSrc,{base:'app/assets/css/'})
    .pipe(rev())
	.pipe(gulp.dest("dist/assets/css"))
	.pipe(rev.manifest({path: 'manifestCSS.json'}))
		.pipe(gulp.dest('.tmp'))
    
});


gulp.task('build', ['inject', 'dist:css'], function () {
	
	var jsSrc = ['app/*.js', '.tmp/partials/*.js'];
    return gulp.src(jsSrc)
	/*.pipe(uglify().on('error', function(uglify) {
        console.error(uglify.message);
        this.emit('end');
    }))*/
    .pipe(rev())
	.pipe(gulp.dest("dist"))
	.pipe(rev.manifest({path: 'manifestJS.json'}))
	.pipe(gulp.dest(".tmp"))
    
    
});

gulp.task('dist', ['build'],   function () {
	return  gulp.src(['.tmp/*.json'])
    .pipe(extend('rev-manifest.json')) // gulp-extend
    .pipe(gulp.dest('.tmp'))
    
});

gulp.task('release', ['dist' ], function () {

	return gulp.src('app/index.html')
       .pipe(revReplace({manifest: gulp.src(".tmp/rev-manifest.json")}))
        .pipe(gulp.dest("dist"))
		

    
});





