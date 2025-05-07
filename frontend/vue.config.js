module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    outputDir: 'dist',
    assetsDir: 'assets',
    devServer: {
      proxy: 'http://localhost:5000'
    }
  };
  