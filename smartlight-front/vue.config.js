const { defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8084,
    proxy: {
      '/dev': {
        target: 'http://43.139.95.60:4006',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/dev': ''
        }
      },
    }
  },
})