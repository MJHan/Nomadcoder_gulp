import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import image from "gulp-image";
import autoprefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";
import ghPages from "gulp-gh-pages";

const sass = require("gulp-sass")(require("node-sass"));

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build",
  },
  img: {
    src: "src/img/*",
    dest: "build/img",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dest: "build/css",
  },
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/main.js",
    dest: "build/js",
  },
  gh: {
    src: "build/**/*",
    publish: ".publish",
  },
};

//사용할 task를 정의
const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del([routes.pug.dest, routes.gh.publish]);

const webserver = () =>
  gulp.src([routes.pug.dest]).pipe(ws({ livereload: true, open: true }));

const img = () =>
  gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const style = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ["@babel/preset-env"] }),
          ["uglifyify", { global: true }],
        ],
      })
    )
    .pipe(gulp.dest(routes.js.dest));

// 연결된 remote github 페이지로 Puhlish한다 - https://mjhan.github.io/Nomadcoder_gulp/
const github = () => gulp.src(routes.gh.src).pipe(ghPages());

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.src, style);
  gulp.watch(routes.js.watch, js);
};

// task들을 그룹화해서 정의
const prepare = gulp.series([clean, img]);
const assets = gulp.series([pug, style, js]);
const live = gulp.parallel([webserver, watch]); //gulp.parallel은 병렬실행(동시실행)시 사용, gulp.series는 순차실행 시 사용

// npm run dev : 그룹화한 task들을 순차적으로 실행
export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, github, clean]);
