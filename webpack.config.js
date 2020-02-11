module.exports = {
  entry: {
    scoring: ['@babel/polyfill', './js/index.js'], // polyfill はIE11などで必要
  },
  output: {
    filename: '[name].bundle.js',
    path: '/home/pi/csms/application/server/public/javascripts'       // path: __dirname + '/public/javascripts'
  },
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { url: false }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  performance: {
    maxEntrypointSize: 500000, // bytes
    maxAssetSize:      500000  // bytes
  }
};