var path = require('path');
module.exports = {
    entry: {
        index: './app/scripts/index/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader?presets[]=react,presets[]=env,plugins[]=transform-decorators-legacy,plugins[]=transform-class-properties'
            }
        ]
    },
    mode: "development",
    devServer: {
        contentBase: path.join(__dirname, "../"),
        compress: true,
        port: 80,
        allowedHosts: [
            "jackwang.com"
        ]
    }
};