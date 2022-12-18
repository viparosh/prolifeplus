module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: '@svgr/webpack',
    })
    config.resolve.fallback = { fs: false }

    return config
  },
  //reactStrictMode: false,
  //webpack5: true,
  optimizeFonts: false,
  env: {
    MONGO_URI:
      'mongodb+srv://inutz123:inutz123@cluster0.vqd1t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  },
}
