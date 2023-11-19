const {srcPath, distPath} = require('./path');

module.exports = {
  config: (routes) => {
    return {
      mode: 'development',
      entry: './src/assets/typescript/index/index.ts',
      output: {
        filename: routes + ".js"
      },
      module: {
        rules: [
          {
            test: /\.css/,
            use: [
              {
                loader: 'style-loader'
              },
              {
                loader: 'css-loader',
                options: {
                  url: false,
                  sourceMap: true,
                },
              },
            ],
          },
          {
            test: /\.ts$/,
            use: 'ts-loader'
          }
        ]
      },
      node: {
        __dirname: false,
        __filename: false
      },
      resolve: {
        extensions: [".ts", ".tsx", ".js"]
      }
    };
  }
}
