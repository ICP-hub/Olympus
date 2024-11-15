require("dotenv").config();
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = (env) => {
  const frontendDirectory = env?.frontend || "IcpAccelerator_frontend"; // Default directory
  const frontendEntry = path.join(
    "src",
    frontendDirectory,
    "src",
    "index.html",
  );

  return {
    target: "web",
    mode: isDevelopment ? "development" : "production",
    entry: {
      index: path.join(__dirname, frontendEntry).replace(/\.html$/, ".jsx"),
    },
    devtool: isDevelopment ? "source-map" : false,
    optimization: {
      minimize: !isDevelopment,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: !isDevelopment, // Remove console.logs in production
            },
          },
        }),
      ],
    },
    resolve: {
      extensions: [".js", ".ts", ".jsx", ".tsx"],
      fallback: {
        assert: require.resolve("assert/"),
        buffer: require.resolve("buffer/"),
        events: require.resolve("events/"),
        stream: require.resolve("stream-browserify/"),
        util: require.resolve("util/"),
        crypto: require.resolve("crypto-browserify"),
        vm: require.resolve("vm-browserify"),
      },
    },
    output: {
      filename: isDevelopment ? "[name].js" : "[name].[contenthash].js",
      path: path.join(__dirname, "dist", frontendDirectory),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|jsx)$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf|otf)$/,
          type: "asset/resource",
        },
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, frontendEntry),
        cache: false,
        minify: isDevelopment
          ? false
          : {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              minifyCSS: true,
            },
      }),
      new webpack.EnvironmentPlugin({
        NODE_ENV: isDevelopment ? "development" : "production",
        FRONTEND_DIR: frontendDirectory,
        API_URL: "http://127.0.0.1:4943/api",
        ...process.env,
      }),
      new webpack.ProvidePlugin({
        Buffer: [require.resolve("buffer/"), "Buffer"],
        process: require.resolve("process/browser"),
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(
              __dirname,
              `src/${frontendDirectory}/src/.ic-assets.json*`,
            ),
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
        },
      },
      static: {
        directory: path.resolve(__dirname, "src", frontendDirectory, "assets"),
      },
      historyApiFallback: true, // SPA fallback
      hot: true,
      allowedHosts: "all", // Allow connections from all hosts
      port: frontendDirectory === "IcpAccelerator_frontend" ? 8080 : 8081,
      client: {
        logging: "info", // Log info-level messages
      },
    },
    stats: {
      warnings: true,
      errors: true,
      errorDetails: true,
      assets: true,
      builtAt: true,
      version: true,
    },
  };
};
