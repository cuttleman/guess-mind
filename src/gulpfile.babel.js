import gulp from "gulp";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import csso from "gulp-csso";
import bro from "gulp-bro";
import del from "del";
import babelify from "babelify";

sass.compiler = require("node-sass");

const clean = () => del(["src/static"]);

const paths = {
  styles: {
    src: "assets/scss/styles.scss",
    dest: "static",
    watch: "assets/scss/**/*.scss"
  },
  js: {
    src: "assets/js/main.js",
    dest: "static",
    watch: "assets/js/**/*.js"
  }
};

const styles = () =>
  gulp
    .src(paths.styles.src)
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(csso())
    .pipe(gulp.dest(paths.styles.dest));

const js = () =>
  gulp
    .src(paths.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({
            presets: ["@babel/preset-env"]
          })
        ]
      })
    )
    .pipe(gulp.dest(paths.js.dest));

const watchFiles = () => {
  gulp.watch(paths.styles.watch, styles);
  gulp.watch(paths.js.watch, js);
};

// eslint-disable-next-line no-unused-vars
export const dev = gulp.series(clean, styles, js, watchFiles);

// eslint-disable-next-line no-unused-vars
export const build = gulp.series(clean, styles, js);
