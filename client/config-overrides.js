module.exports = function override(config, env) {
  console.log('React app rewired works!');
  /** do stuff with the webpack config... */
    resolve: {
      fallback: {
        fs: false,
        os: require.resolve("os-browserify/browser"),
        path: require.resolve("path-browserify")
      }
    }
  }
  return config
}
