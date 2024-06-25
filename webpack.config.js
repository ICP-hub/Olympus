require("dotenv").config();
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = (env) => {
  const frontendDirectory = env.frontend ?? "IcpAccelerator_frontend" ?? 'admin_frontend';  // Add a default value or handle the case where env.frontend is undefined
  const frontendEntry = path.join("src", frontendDirectory, "src", "index.html");

  console.log("Entry Path:", frontendEntry);
  console.log("Resolved Entry Path:", path.resolve(__dirname, frontendEntry));

  return {
    target: "web",
    mode: isDevelopment ? "development" : "production",
    entry: {
      index: path.join(__dirname, frontendEntry).replace(/\.html$/, ".jsx"),
    },
    devtool: isDevelopment ? "source-map" : false,
    optimization: {
      minimize: !isDevelopment,
      minimizer: [new TerserPlugin()],
    },
    resolve: {
      extensions: [".js", ".ts", ".jsx", ".tsx"],
      fallback: {
        assert: require.resolve("assert/"),
        buffer: require.resolve("buffer/"),
        events: require.resolve("events/"),
        stream: require.resolve("stream-browserify/"),
        util: require.resolve("util/"),
      },
    },
    output: {
      filename: "index.js",
      path: path.join(__dirname, "dist", frontendDirectory),
    },
    module: {
      rules: [
        { test: /\.(ts|tsx|jsx)$/, loader: "ts-loader" },
        { test: /\.css$/, use: ["style-loader", "css-loader", "postcss-loader"] },
        { test: /\.(png|jpe?g|gif|svg)$/, use: "file-loader" },
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, frontendEntry.replace('.jsx', '.html')),
        cache: false,
      }),
      new webpack.EnvironmentPlugin([
        ...Object.keys(process.env).filter((key) => {
          if (key.includes("CANISTER")) return true;
          if (key.includes("DFX")) return true;
          return false;
        }),
      ]),
      new webpack.ProvidePlugin({
        Buffer: [require.resolve("buffer/"), "Buffer"],
        process: require.resolve("process/browser"),
      }),
      new CopyPlugin({
        patterns: [
          {
            from: `src/${frontendDirectory}/src/.ic-assets.json*`,
            to: ".ic-assets.json5",
            noErrorOnMissing: true,
          },
        ],
      }),
    ],
    devServer: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:4943",
          changeOrigin: true,
          pathRewrite: {
            "^/api": "/api",
          },
        },
      },
      static: path.resolve(__dirname, "src", frontendDirectory, "assets"),
      hot: true,
      watchFiles: [path.resolve(__dirname, "src", frontendDirectory)],
      liveReload: true,
      port: frontendDirectory === "IcpAccelerator_frontend" ? 8080 : 8081,
    },
  };
};
