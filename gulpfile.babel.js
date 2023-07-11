import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import image from "gulp-image";

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
};

//사용할 task를 정의
const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));
const clean = () => del([routes.pug.dest]);
const webserver = () =>
  gulp.src([routes.pug.dest]).pipe(ws({ livereload: true, open: true }));
const img = () =>
  gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));
const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
};

// task들을 그룹화해서 정의
const prepare = gulp.series([clean, img]);
const assets = gulp.series([pug]);
const postDev = gulp.parallel([webserver, watch]); //gulp.parallel은 병렬실행(동시실행)시 사용, gulp.series는 순차실행 시 사용

// npm run dev : 그룹화한 task들을 순차적으로 실행
export const dev = gulp.series([prepare, assets, postDev]);
