module.exports = {
  /*
  ** Headers of the page
  */
  plugins:['~plugins/vuetify.js'],
  head: {
    title: 'graduation-web',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Graduation Website' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },
  css: [
    '@/assets/css/main.scss',
    '@/node_modules/vuetify/dist/vuetify.min.css',
    '@/assets/css/fontiran.css',
    '@/assets/css/bootstrap-grid.min.css',
    '@/node_modules/@mdi/font/css/materialdesignicons.min.css',


  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
