const typescript = require('gulp-typescript');
const gulp = require('gulp');
const { series } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const del = require('del');
const sh = require('gulp-sh');
const jest = require('gulp-jest').default;

const tsProject = typescript.createProject('tsconfig.json');

gulp.task("clean", () => {
    return del([
        "dist",
        "*.zip",
        "coverage",
        ".sonar",
        ".nyc_output",
        "test-reports",
        "src/**/*.js",
        "test/**/*.js",
        "src/**/*.js.map",
        "test/**/*.js.map",
    ]);
});

gulp.task('compile', () => {
    const tsResult = tsProject
        .src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    tsResult.js
        .pipe(sourcemaps.write({
            includeContent: false,
            sourceRoot: file => file.base,
        }))
        .pipe(gulp.dest('dist'));

    return gulp.src('resource/**/*')
        .pipe(gulp.dest('dist/resource'));
});

gulp.task('watch', () =>
    gulp.watch(['src/**/*.ts', 'test/**/*.ts'], ['compile']),
);

gulp.task('lint', () =>
    gulp.src('src/**/*.ts,test/**/*.ts')
        .pipe(tslint({
            formatter: 'verbose',
            program: require('tslint').Linter.createProgram('./tsconfig.json'),
        }))
       .pipe(tslint.report()),
);


gulp.task("create-report-directory", sh("mkdir -p test-reports"));

gulp.task("run-cucumber-tests",
    sh("./node_modules/.bin/cucumber-js test/**/*.feature "
        + " --require-module ts-node/register --require test/**/*.ts"
        + " --require test/steps"
        + " --format progress:test-reports/report.txt"
        + " --tags 'not @ignore and not @manual'")
);

gulp.task("cucumber", series("create-report-directory", "run-cucumber-tests"));

gulp.task("jest", () =>
    gulp.src("src")
        .pipe(jest({
                "roots": [
                    "<rootDir>/src"
                ],
                "transform": {
                    "^.+\\.tsx?$": "ts-jest"
                },
                "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
                "moduleFileExtensions": [
                    "ts",
                    "tsx",
                    "js",
                    "jsx",
                    "json",
                    "node"
                ],
                "verbose":true
            })
        )
);

gulp.task("unit-test", series("clean", "compile" ,"jest"));

gulp.task("bdd-test", series("clean", "compile" ,"cucumber"));

gulp.task("test", series("clean", "compile" ,"jest", "cucumber"));

gulp.task('default', series('clean', 'compile', 'lint'));
