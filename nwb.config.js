module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactFullStoryExcluder',
      externals: {
        react: 'React'
      }
    }
  }
}
