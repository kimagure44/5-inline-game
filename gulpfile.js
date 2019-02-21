const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () => {
    gulp.watch('js/main.js', done => {
        gulp.src('js/main.js')
        .pipe(babel({"presets": ["env"]}))    
        .pipe(gulp.dest('dist'));
        done();
    })
});
