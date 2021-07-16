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
    config: (config) => {
      if (config.mode === "development") {
        config.entry = "./demo/src/index.tsx";
      } else {
        config.entry = "./src/index.tsx";
      }
      return config;
    },
    extra: {
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
      module: {
        rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
      },
    },
  },
};
