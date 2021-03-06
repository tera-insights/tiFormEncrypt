var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var shell = require('gulp-shell');
var typedoc = require("gulp-typedoc");
var dts = require('dts-bundle');

var tsProject = ts.createProject({
    module: "commonjs",
    target: "es5",
    preserveConstEnums: true,
    sourceMap: true
});

gulp.task('typescript', function () {
    var result = gulp.src('src/index.ts')
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return result.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('typescript-server', function () {
    var result = gulp.src('src/server.ts')
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return result.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/server/'));
});

gulp.task('typings', function(){
    dts.bundle({
        name: "tiForms",
        main: "dist/dts/server.d.ts",
        out: "dist/server.d.ts"
    });
});

/**
  * Auxiliary function to deal with typedoc
*/
function makeTypedoc(src, dir) {
    return gulp
        .src(src)
        .pipe(typedoc({
            // TypeScript options (see typescript docs) 
            module: "commonjs",
            target: "es5",
            preserveConstEnums: true,
            // sourceMap: true,
            // Output options (see typedoc docs) 
            out: dir,
            json: dir + "/tiEnclave.json",

            // TypeDoc options (see typedoc docs) 
            name: "tiEnclave",
            // theme: "/path/to/my/theme",
            // plugins: ["my", "plugins"],
            ignoreCompilerErrors: true,
            version: true,
        }))
        ;
}

gulp.task("typedoc", function () {
    return makeTypedoc(["src/*.ts"], "./doc");
});

gulp.task('watch', function () {
    gulp.watch('src/*.ts', ['build']);
});

gulp.task('build', shell.task('webpack'));
gulp.task('default', ['build', 'watch']);
gulp.task('test', ['build'], shell.task('karma start'));