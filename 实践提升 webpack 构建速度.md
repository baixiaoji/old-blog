## 实践提升 webpack 构建速度

前提：项目是 Vue-cli@2.x创建。

本周优化了手头项目webpack构建速度，大致思考和实践记录在下面。

### 发现问题

作者需要明确知道自己项目的问题然后进行修改，这才是真正的真正的提升项目速度。（PS：当然网上资料梭哈一下，或是也能优化问题）

以下给出两个plugin帮助作者可以分析问题

1. `speed-measure-webpack-plugin` 获得详细耗时（包括总时长，各个loader和plugin的耗时）

2. `webpack-bundle-analyzer` 获得项目打包体积详情（可查看那些文件较大）

#### 如何引用

speed-measure-webpack-plugin

```javascript
// 1. npm install -D speed-measure-webpack-plugin

// 2. vue.config.js
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

// https://github.com/stephencookdev/speed-measure-webpack-plugin
const smp = new SpeedMeasurePlugin({
  outputTarget: './smp.dat', // 日志输出文件
  disable: false,
});

module.exports = {
  // ...
  configureWebpack: smp({
    // your config
  })
  // ...
}
```

webpack-bundle-analyzer

```javascript
// 1. npm install -D webpack-bundle-analyzer

// 2. vue.config.js

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  // ...
	chainWebpack: config => {
   config.plugin('analyzer').use(new BundleAnalyzerPlugin()) 
  }
  // ...
}
```

运行`npm run build`，打包完成自动打开`http://127.0.0.1:8080`，可以查看打包文件大小分布情况，然后分析。(PS:记得部署上线之前需要需要关闭，当然若上线部署有特殊的环境变量即可自行添加判断语句)

### 解决问题

查看 bundle-analyzer 结果，发现`moment`、`xlsx`、`pdf-js`、`lodash`体积过大。

对于`moment`解决方案有印象，其locale存在大量的地区设置，所以主要在打包的过程中忽略掉即可。

```js
module.exports = {
  // ...
	chainWebpack: config => {
   config.plugin('ignore').use(new webpack.IgnorePlugin(/^\.\/locale$/,/moment$/));//忽略/moment/locale下的所有文件
  }
  // ...
}
```

`xlsx`查看引用，发现引用依赖的是源代码，查看npm包之后，修改成了压缩版本。

`pdf-js`搜索到了引用组件，使用WebStorm Find Usage功能，发现组件并没被引用，直接删除组件。

`lodash`查看了大量地方引用了个别功能，但是其引用方式都是`import {x} from lodash`，虽说 ES Module 有 tree-shaking功能，但是要求必须引用的文件同样是ES Module格式编写才行，所以将引用方式改为按需引用修改为`import x from lodash/x`。

后续查询资料发现有`lodash-webpack-plugin`和`babel-plugin-lodash`插件，功能就是你按照正常逻辑写代码，插件帮改成你按需加载代码。

具体使用：[lodash-webpack-plugin](https://github.com/lodash/lodash-webpack-plugin) [babel-plugin-lodash](https://www.npmjs.com/package/babel-plugin-lodash)

看了大量博客都会推荐使用webpack内置的DLLPlugin。其思路就是将应用中依赖的**不会发生变更**的模块（如：Vue全家桶、axios、UI库），预先进行打包成一个单独文件。

而当后续应用构建时，当引用到已打包的模块，则会到单独文件中获取模块，而不会再次打包模块。

实践的具体思路就是，单独创建一个`webpack.dll.js`配置，如下：

```js
// webpack.dll.js
const path = require('path');
const webpack = require('webpack');
// "clean-webpack-plugin": "^3.0.0"
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// dll文件存放的目录
const dllPath = 'public/vendor';

module.exports = {
  mode: 'production',
  entry: {
    // 需要提取的库文件
    vendor: ['vue', 'vue-router', 'vuex', 'axios', 'element-ui']
  },
  output: {
    path: path.join(__dirname, dllPath),
    filename: '[name].dll.js',
    // vendor.dll.js中暴露出的全局变量名
    // 保持与 webpack.DllPlugin 中名称一致
    library: '[name]_[hash]'
  },
  plugins: [
    // 清除之前的dll文件
    new CleanWebpackPlugin(['*.*'], {
      root: path.join(__dirname, dllPath)
    }),
    // "clean-webpack-plugin": "^3.0.0"
    // new CleanWebpackPlugin(),
    // 设置环境变量
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      }
    }),
    // manifest.json 描述动态链接库包含了哪些内容
    new webpack.DllPlugin({
      path: path.join(__dirname, dllPath, '[name]-manifest.json'),
      // 保持与 output.library 中名称一致
      name: '[name]_[hash]',
      context: process.cwd()
    })
  ]
};

```

多加一个`npm scripts`用来预先打包模块，

```bash
// package.json 
// "dll": "webpack --config webpack.dll.js --colors --display-modules"
npm run dll
```

而后在`vue.config.js`使用`DllReferencePlugin`进行关联预先输出的文件。

```js
module.exports = {
  configureWebpack: {
    plugins: [
       new webpack.DllReferencePlugin({
        context: process.cwd(),
        // 告诉webpack使用的动态链接库
        manifest: require('./public/vendor/vendor-manifest.json'),
      }),
    ]
}
```

以及你可以手动在`index.html`上添加一行单独文件的脚本引入。但由于构建过后大多都是存在`build`目录下，防止先前脚本引入出现404现象，所以还需要使用`copy-webpack-plugin`进行移动到相对目录下。

取而代之，可以使用`add-asset-html-webpack-plugin`将生成的dll文件自动加到`index.html`中。

```js
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
module.exports = {
  configureWebpack: {
    plugins: [
      new AddAssetHtmlPlugin({
        // dll文件位置
        filepath: path.resolve(__dirname, './public/vendor/*.js'),
        // dll 引用路径
        publicPath: isProd ? './static/vendor' : './vendor',
        // dll最终输出的目录
        outputPath: './vendor',
        includeSourcemap: false,
      })
    ]
}
```

配置过程中需要检查一下`vue.config.js` baseUrl是做过环境变量区分。

当然配置以上开发过程中就不会遇见问题了。但是根据网上资料配置过程完成之后，运行代码发现控制台报如下错误：

```bash
Uncaught ReferenceError: production is not defined
```

后来发现是DefinePlugin的问题，所以在必须`JSON.stringify`以下属性值。大致原因是，在注入环境变量的时候，只有一层引号包裹住的话，插件在打包过程时候会帮你 unwrap 当做变量插入，最终导致报错，[信息来源](https://github.com/facebook/react/issues/7032#issuecomment-225665435)。

而后执行 build 命令，确实快了些，而且正常开发下构建编译也快了点。不知道是否是心理作用。

但是从 bundle 信息开看，其实存在部分chunk将dll抽取的模块再次打包进去。所以会产生困惑。

> 就是element-ui部分组件被打到了其他的chunk中，不知是否是因为使用babel按需加载插件的原因。

关于DLLPlugin先前思考记在这里：

使用内置的DLLPlugin，将不常更新的框架和库进行单独编译打包。然后在主配置中使用DLLReferencePlugin进行引用生产的manifest文件。

确实会提高速度，核心就是减少了每一次更新代码时候重复编译打包依赖库（这里有疑惑点，webpack为什么每一次更新打包会重新编译打包依赖库呢？~~自己的理由是存在cache，理解中cache就是保留上次的编译结果，那为什么不能缓存这些依赖模块呢？~~好像这个插件就是为了提供这样功能的）。

### 其余解决方案

网上说使用HappyPack，可以多线程打包代码。但是实践之后发现并没有什么提升，然后查看了资料发现vue已经使用了 thread-loader。

当然可以将某些类库改成外部引用，只要配置webpack的externals。虽然知道会取自CDN的文件，确实减少了打包的体积，但是在在页面请求中不就了一个请求吗？若直接把Vue等级改成外部引用，那这个请求的优先级还要高。

### 最终结果

build的构建时间从3min45sec降到了1min28sec（还要加上一次创建dll的时间，大致1200ms）。

入口文件大小从3.35M降到了2.8M，但是index.html文件多了一个dll脚本引入，大小600kb。

bundle打包出来看gzipped过后全量文件的大小从1.77MB 降到了 1.69MB。

### 参考资料

1. [vue-cli3.0 webpack打包速度优化](https://zhuanlan.zhihu.com/p/83930020)

2. [探索webpack构建速度提升方法和优化策略](https://juejin.im/post/5e6502fa51882549052f531b)

3. [基于vue-cli的webpack打包优化实践及探索](http://blog.itpub.net/69946034/viewspace-2659968/)

4. [首屏时间从12.67s到1.06s，我是如何做到的？](https://mp.weixin.qq.com/s?__biz=MzUxMzcxMzE5Ng==&mid=2247489586&idx=1&sn=2168d42df837521da50b3ed7f8932698&chksm=f951ad71ce262467728b7940de1a2311c523f264f4ca7e705712bf655a844fab93706cbe1ca3&token=1792152421&lang=zh_CN#rd)

5. [Webpack打包优化](https://juejin.im/post/5b1e303b6fb9a01e605fd0b3)

6. [vue-cli3 DllPlugin 提取公用库](https://juejin.im/post/5c7e76bfe51d4541e207e35a)





