var path = require('path');
module.exports = {
    entry: {
        index: './app/scripts/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/scripts')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader?presets[]=react,presets[]=env'
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "../"),
        compress: true,
        port: 80,
        allowedHosts: [
            "jackwang.com"
        ]
    }
};