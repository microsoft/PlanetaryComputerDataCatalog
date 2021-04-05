const { addBeforeLoader, loaderByName } = require("@craco/craco");
const CopyPlugin = require("copy-webpack-plugin");
const marked = require("marked");
const renderer = new marked.Renderer();

// Allows import of yaml files as json
const yamlLoader = {
  test: /\.ya?ml$/,
  exclude: /node_modules/,
  use: [
    { loader: require.resolve("json-loader") },
    { loader: require.resolve("yaml-loader") },
  ],
};

// Allows import of md files as html
const mdLoader = {
  test: /\.md$/,
  use: [
    {
      loader: require.resolve("html-loader"),
    },
    {
      loader: require.resolve("markdown-loader"),
      options: {
        renderer,
      },
    },
  ],
};

const prettierLoader = {
  test: /\.jsx?$/,
  use: [
    {
      loader: require.resolve("prettier-loader"),
      options: {
        exclude: /node_modules/,
        enforce: "pre",
      },
    },
  ],
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
            },
            // Transform .md to html and copy into the static asset director at build
            {
              from: "etl/_codefile_output/*.md",
              to: "static/metadata/[name].html",
              transform: content => {
                const htmlOut = marked(content.toString("utf8"));
                return Buffer.from(htmlOut, "utf8");
              },
            },
          ],
        }),
      ],
    },
    configure: webpackConfig => {
      addBeforeLoader(webpackConfig, loaderByName("file-loader"), mdLoader);
      addBeforeLoader(webpackConfig, loaderByName("file-loader"), yamlLoader);
      addBeforeLoader(
        webpackConfig,
        loaderByName("file-loader"),
        prettierLoader
      );

      return webpackConfig;
    },
  },
};
