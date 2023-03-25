const cssModulesPlugin = require("esbuild-css-modules-plugin");
const svgrPlugin = require("esbuild-plugin-svgr");
const rails = require("esbuild-rails");

require("esbuild")
  .build({
    entryPoints: ["app/javascript/application.js"],
    outfile: "app/assets/build/application.js",
    bundle: true,
    plugins: [cssModulesPlugin(), svgrPlugin()],
    publicPath: "assets",
    assetNames: "[name]-[hash].digested.[ext]",
    loader: {
      ".js": "jsx",
      ".ts": "tsx",
      ".png": "file",
      ".jpg": "file",
      ".css": "css",
      ".svg": "dataurl"
    },

    watch: true,
  })
  .then(() => console.log("⚡ Doneeeee"))
  .catch(() => process.exit(1));
