const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  test: {
    globals: true,
    environment: 'happy-dom'
  }
})
