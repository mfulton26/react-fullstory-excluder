module.exports = {
  type: "react-component",
  npm: {
    esModules: true,
    umd: {
      global: "ReactFullStoryExcluder",
      externals: {
        react: "React",
      },
    },
  },
  webpack: {
    extra: {
      entry: "./src/index.tsx",
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
      module: {
        rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
      },
    },
  },
};
