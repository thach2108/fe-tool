"use strict";
import gulp from "gulp";
import del from "del";
import fs from "fs";
import browserSync from "browser-sync";
import gulpLoadPlugins from "gulp-load-plugins";
import syntax from "postcss-scss";
import deleteEmpty from "delete-empty";

import PLUGINS from "./config/postcss.config";
import COPY_FILES from "./config/copy-files.config";
import JS_ROOTMAP from "./config/js-rootmap";

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const debug = require("postcss-debug").createDebugger();

require("gulp-stats")(gulp);

const path = {
  scss: "src/dev/scss/",
  js: "src/dev/js",
};

gulp.task("pug", () => {
  return gulp
    .src(["src/pages/*.pug"])
    .pipe(
      $.pugLinter({
        reporter: (er) => {
          $.notify.onError();
        },
      })
    )
    .pipe(
      $.data((file) => {
        return JSON.parse(fs.readFileSync("src/_data/data.json"));
      })
    )
    .pipe($.plumber())
    .pipe($.plumberNotifier())
    .pipe(
      $.pug({
        // pretty: '\t'
        pretty: true,
      })
    )
    .pipe(gulp.dest("dist/"));
});

gulp.task("styles", () => {
  return gulp
    .src([path.scss + "style.scss"])
    .pipe($.newer("dist/"))
    .pipe($.sourcemaps.init())
    .pipe($.plumber())
    .pipe($.plumberNotifier())
    .pipe(
      $.sass.sync({
        outputStyle: "expanded",
      })
    )
    .pipe($.postcss(debug(PLUGINS), { parser: syntax }))
    .pipe($.sourcemaps.write("."))
    .pipe(gulp.dest("dist/"))
    .pipe($.size({ title: "styles" }));
});

gulp.task("lint:css", () => {
  return gulp.src(["src/components/**/*.scss"]).pipe(
    $.stylelint({
      reporters: [
        {
          formatter: "verbose",
          console: true,
        },
      ],
      failAfterError: false,
    })
  );
});

gulp.task(
  "css-debug",
  gulp.series("styles", (cb) => {
    debug.inspect();
    cb();
  })
);

gulp.task("images", () => {
  return gulp
    .src("src/images/**/*")
    .pipe($.newer("dist/images/"))
    .pipe(
      $.cache(
        $.imagemin({
          progressive: true,
          interlaced: true,
        })
      )
    )
    .pipe(gulp.dest("dist/images/"))
    .pipe($.size({ title: "images" }));
});

gulp.task("images_dev", () => {
  return gulp
    .src("src/images/**/*")
    .pipe($.newer("dist/images/"))
    .pipe(
      $.cache(
        $.imagemin({
          progressive: true,
          interlaced: true,
        })
      )
    )
    .pipe(gulp.dest("dist/images/"));
});

gulp.task("scripts", () => {
  return gulp
    .src(JS_ROOTMAP)
    .pipe($.concat("core.js"))
    .pipe($.newer("dist/js/"))
    .pipe($.babel())
    .pipe($.uglify())
    .pipe(gulp.dest("dist/js/"))
    .pipe($.size({ title: "scripts" }));
});

gulp.task("clean", () => {
  return del(["dist"], { dot: true });
});

gulp.task("delete-empty", (cb) => {
  deleteEmpty.sync("dist/");
  cb();
});

gulp.task("copy", () => {
  return gulp
    .src(COPY_FILES, {
      base: "src",
    })
    .pipe(gulp.dest("dist"))
    .pipe($.size({ title: "copy" }));
});

gulp.task(
  "serve",
  gulp.series(
    "clean",
    "styles",
    "scripts",
    "pug",
    "images_dev",
    "copy",
    "delete-empty",
    (cb) => {
      browserSync({
        notify: true,
        server: ["dist", "src"],
        port: 3000,
      });

      gulp.watch(
        "src/_data/data.json",
        gulp.series("pug", (cb) => {
          reload();
          cb();
        })
      );
      gulp.watch(
        "src/**/**/*.scss",
        gulp.series("lint:css", "styles", (cb) => {
          reload();
          cb();
        })
      );
      gulp.watch(
        "src/dev/js/*.js",
        gulp.series("scripts", (cb) => {
          reload();
          cb();
        })
      );
      gulp.watch(
        "src/**/**/*.pug",
        gulp.series("pug", (cb) => {
          reload();
          cb();
        })
      );

      reload();
      cb();
    }
  )
);

gulp.task(
  "watch",
  gulp.series(
    "clean",
    "styles",
    "scripts",
    "pug",
    "images_dev",
    "copy",
    "delete-empty",
    (cb) => {
      gulp.watch(
        "src/_data/data.json",
        gulp.series("pug", (cb) => {
          reload();
          cb();
        })
      );
      gulp.watch(
        "src/**/**/*.scss",
        gulp.series("lint:css", "styles", (cb) => {
          reload();
          cb();
        })
      );
      gulp.watch(
        "src/dev/js/*.js",
        gulp.series("scripts", (cb) => {
          reload();
          cb();
        })
      );
      gulp.watch(
        "src/**/**/*.pug",
        gulp.series("pug", (cb) => {
          reload();
          cb();
        })
      );
      cb();
    }
  )
);

gulp.task(
  "default",
  gulp.series(
    "clean",
    "styles",
    "scripts",
    "pug",
    "images",
    "copy",
    "delete-empty",
    (cb) => cb()
  )
);
