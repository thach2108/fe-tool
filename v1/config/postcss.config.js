import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import reporter from 'postcss-reporter';
import assets from 'postcss-assets';
import immutableCss from 'immutable-css';
import messages from 'postcss-browser-reporter';
import pxtorem from 'postcss-pxtorem';
import fontpath from 'postcss-fontpath';

const PLUGINS = [
  assets({
    basePath: 'src/',
    loadPaths: ['images/', 'fonts/**/'],
    relative: true
  }),
  fontpath({
    checkFiles: true,
    ie8Fix: true
  }),
  immutableCss,
  // cssnano({
  //   autoprefixer: false,
  //   zindex: false,
  //   minifyFontValues: false,
  //   discardUnused: false
  // }),
  // pxtorem({
  //   rootValue: 16,
  //   unitPrecision: 5,
  //   propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
  //   selectorBlackList: ['html', 'body'],
  //   replace: true,
  //   mediaQuery: false,
  //   minPixelValue: 0
  // }),
  autoprefixer({
    browsers: ["last 50 versions", "ie >= 9"],
    cascade: false
  }),
  reporter({
    clearMessages: true,
    throwError: false
  }),
  messages({
    selector: 'body::before'
  })
]

export default PLUGINS;
