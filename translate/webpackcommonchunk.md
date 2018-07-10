## About CommonChunkPlugin 

#### 无法抽取单入口文件公共模块

#### 抽取多入口文件公共模块

#### 分离业务代码与框架代码

```Javascript
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
module.exports = {
    entry: {
        main: process.cwd()+'/example3/main.js',
        main1: process.cwd()+'/example3/main1.js',
        common1:["jquery"],
        //只含有 jquery.js
        common2:["vue"]
        //只含有 vue.js 和加载器代码
    },
    output: {
        path: process.cwd()+'/dest/example3',
        filename: '[name].js'
    },
    plugins: [
        new CommonsChunkPlugin({
            name: ["chunk",'common1','common2'],
            minChunks:2
            //引入两次以及以上的模块
        })
    ]
};
```

