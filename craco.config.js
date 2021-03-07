const { addBeforeLoader, loaderByName } = require("@craco/craco");

// Allows transform + copy to dist on build
const yaml = require("js-yaml");
const CopyPlugin = require("copy-webpack-plugin");

const marked = require("marked");
const renderer = new marked.Renderer();

// Allows *import* of yaml files as json
const yamlLoader = {
  test: /\.ya?ml$/,
  exclude: /node_modules/,
  use: [
    { loader: require.resolve("json-loader") },
    { loader: require.resolve("yaml-loader") },
  ],
};

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

module.exports = {
  webpack: {
    plugins: {
      add: [
        new CopyPlugin({
          patterns: [
            {
              from: "metadata/**/*.yml",
              to: "static/metadata/[name].json",
              transform: (content) => {
                const jsonOut = JSON.stringify(
                  yaml.load(content.toString("utf8"), {
                    schema: yaml.JSON_SCHEMA,
                  })
                );
                console.log(jsonOut);
                return Buffer.from(jsonOut, "utf8");
              },
            },
          ],
        }),
      ],
    },
    configure: (webpackConfig) => {
      addBeforeLoader(webpackConfig, loaderByName("file-loader"), mdLoader);
      addBeforeLoader(webpackConfig, loaderByName("file-loader"), yamlLoader);

      return webpackConfig;
    },
  },
};
