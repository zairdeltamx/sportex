
require("esbuild").build(
    {
        entryPoints: ["app/javascript/application.js"],
        outfile: "app/assets/build/application.js",
        bundle: true,
        plugins: [
        ],
        publicPath: "assets",
        assetNames: "[name]-[hash].digested",
        loader: { ".js": 'jsx', '.png': 'file', '.jpg': 'file' },
        watch: false,

    })
    .then(() => console.log("⚡ Done"))
    .catch(() => process.exit(1));


