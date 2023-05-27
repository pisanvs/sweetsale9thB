const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: [
        "./src/index.js",
        "./src/inflow.js"
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].bundle.js",
        clean: true
    },
    devServer: {
        static: "./dist"
    },
    plugins: [
        ...generateHtmlPlugins("./src/html/")
    ]
};

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(templateDir);

  return templateFiles.map((name) => {
    const templatePath = path.join(templateDir, name);

    return new HtmlWebpackPlugin({
      template: templatePath,
      filename: name,
    });
  });
}