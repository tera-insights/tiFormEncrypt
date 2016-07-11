var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var shell = require('gulp-shell');
var typedoc = require("gulp-typedoc");

var tsProject = ts.createProject({
    module: "commonjs",
    target: "es5",
    preserveConstEnums: true,
    sourceMap: true
});

gulp.task('typescript', function () {
    var result = gulp.src('src/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));

    return result.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js/'));
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
    gulp.watch('src/*.ts', ['typescript']);
});

gulp.task('build', ['typescript']);
gulp.task('default', ['build', 'watch']);