import cssModulesPlugin from 'esbuild-css-modules-plugin';
import svgrPlugin from 'esbuild-plugin-svgr';
import { sassPlugin } from 'esbuild-sass-plugin';
// import { ScssModulesPlugin } from "esbuild-scss-modules-plugin";
// import litPlugin from "esbuild-plugin-lit";

import * as esbuild from 'esbuild';

let ctx = await esbuild.context({
  entryPoints: ['app/javascript/application.js'],
  outfile: 'app/assets/build/application.js',
  plugins: [
    cssModulesPlugin(),
    svgrPlugin(),
    sassPlugin(),
    // ScssModulesPlugin({
    //   inject: false,
    //   minify: true,
    //   cssCallback: (css) => console.log(css),
    // }),
    // litPlugin(),
  ],
  publicPath: 'assets',
  bundle: true,
  assetNames: '[name]-[hash].digested.[ext]',
  loader: {
    '.js': 'jsx',
    '.ts': 'tsx',
    '.png': 'file',
    '.jpg': 'file',
    '.css': 'css',
    '.svg': 'dataurl',
  },
});

await ctx.watch();
// await ctx.dispose();
console.log('watching.............');
