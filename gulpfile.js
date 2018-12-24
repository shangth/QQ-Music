var gulp = require('gulp');
var htmlclean = require('gulp-htmlclean');
var imageMin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var stripDebug = require('gulp-strip-debug');
var less = require('gulp-less');
var cleanCss = require('gulp-clean-css');
var postCss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var concat = require('gulp-concat');

var connect = require('gulp-connect');


// 设置路径
var folder = {
    src:'src/',
    dist:'dist/'
}

// 判断环境
var devMod = process.env.NODE_ENV == 'development';
console.log(devMod);


// html流水线
gulp.task('html', function () {
    var page = gulp.src(folder.src + 'html/*')
        .pipe(connect.reload());
        if (!devMod) {
            page = page.pipe(htmlclean());
        }
        page.pipe(gulp.dest(folder.dist + 'html/'));
})

// css流水线
gulp.task('css', function () {
    var page = gulp.src(folder.src + 'css/*')
        .pipe(connect.reload())
        .pipe(less())
        .pipe(postCss([autoprefixer()]));
        if (!devMod) {
            page = page.pipe(cleanCss());
        }
        page.pipe(gulp.dest(folder.dist + 'css/'))
})

// // less流水线
// gulp.task('less', function () {
//     gulp.src(folder.src + 'less/*')
//         .pipe(connect.reload())
//         .pipe(less())
//         .pipe(gulp.dest(folder.dist + 'less/'))
// })

// js流水线
gulp.task('js', function () {
    var page = gulp.src(folder.src + 'js/*')
        .pipe(connect.reload());
        if(!devMod){
            page = page.pipe(stripDebug())
            .pipe(babel())
            .pipe(uglify())
            .pipe(concat('app.js'))
        }
        page.pipe(gulp.dest(folder.dist + 'js/'))
})

// img流水线
gulp.task('img', function () {
    gulp.src(folder.src + 'img/*')
        .pipe(connect.reload())
        .pipe(imageMin({
            optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(folder.dist + 'img/'))
})

// 开启服务
gulp.task('server', function () {
    connect.server({
        port: '8888',
        livereload: true
    });
})

// 监听
gulp.task('watch', function () {
    gulp.watch(folder.src + 'html/*',['html']);
    gulp.watch(folder.src + 'css/*',['css']);
    gulp.watch(folder.src + 'js/*',['js']);
    gulp.watch(folder.src + 'less/*',['less']);
    gulp.watch(folder.src + 'img/*',['img']);
})


// 设置默认执行任务
gulp.task('default', ['html', 'css', 'js', 'img', 'server', 'watch'])