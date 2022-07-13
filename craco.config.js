const webpack = require("webpack");

const CopyPlugin = require("copy-webpack-plugin");
const { marked } = require("marked");

// Allows import of yaml files as json
const yamlLoader = {
  use: [
    { loader: require.resolve("json-loader") },
    { loader: require.resolve("yaml-loader"), options: { asJSON: true } },
  ],
  test: /\.ya?ml$/,
  exclude: /node_modules/,
};

module.exports = {
  webpack: {
    plugins: {
      add: [
        new CopyPlugin({
          patterns: [
            // Copy html from converted notebooks into the static asset director at build
            {
              from: "etl/_codefile_output/*.html",
              to: "static/metadata/[name].html",
              noErrorOnMissing: true,
            },
            // Transform .md to html and copy into the static asset director at build
            {
              from: "etl/_codefile_output/*.md",
              to: "static/metadata/[name].html",
              transform: content => {
                const htmlOut = marked(content.toString("utf8"));
                return Buffer.from(htmlOut, "utf8");
              },
              noErrorOnMissing: true,
            },
          ],
        }),
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
          http: "stream-http",
        }),
      ],
    },
    configure: webpackConfig => {
      // Load the yaml-loader first in list of loaders, allows use of yaml files imported as json
      webpackConfig.module.rules[1].oneOf.unshift(yamlLoader);

      // See: https://github.com/JS-DevTools/ono/issues/18
      webpackConfig.ignoreWarnings = [/Failed to parse source map/];

      // Fallback entries are required pollyfill fallbacks for webpack v5 to use the
      // "@apidevtools/json-schema-ref-parser" module, which isn't configurable for
      // browser-only builds. An upgrade in the future may make these, and their
      // package.json entries, unnecessary.
      const fallbacks = {
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        process: require.resolve("process/browser"),
      };
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        ...fallbacks,
      };
      return webpackConfig;
    },
  },
};
