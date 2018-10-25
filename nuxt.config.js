module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'myapp',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script:[
      {
      src:"//unpkg.com/wangeditor/release/wangEditor.min.js"
    }
    ]
  },
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
    },
    vendor: ['axios','qs']
  },
  plugins: [{
    src: '~plugins/element-ui',
    ssr: true,
  },{
    src:'~plugins/echarts',
    ssr:true
  }
  ],
  css: [
    'element-ui/lib/theme-chalk/index.css',
    'element-ui/lib/theme-chalk/display.css',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  proxy: [
    [
      '/api',
      {
        target: 'http://www.tiannoyi.com/video',
        pathRewrite: { '^/api' : '/' }
      }
    ]
  ],
}
