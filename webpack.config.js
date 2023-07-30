const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    inflow: "./src/inflow.js",
    auth: "./src/auth.js",
    pos: "./src/pos.js",
    stats: "./src/stats.js"
  },
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
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(templateDir);

  return templateFiles.map((name) => {
    const templatePath = path.join(templateDir, name);

    return new HtmlWebpackPlugin({
      template: templatePath,
      filename: name,
      inject: 'body',
      chunks: [name.replace('.html', '')]
    });
  });
}