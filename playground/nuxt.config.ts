export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  pageData: {
    debug: true,
  },
  devServer: {
    port: 8000,
  },
})
