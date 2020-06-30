## Webpack solves Web Performance issues

以下为部分笔记，查看了这个[webpack workshop ppt](https://docs.google.com/presentation/d/1FW3GT9Ww1S6SEGu8HAO5eRZUFggfVuFE2ievNCDWVDo/edit#slide=id.g376e8d6b61_0_4)

web应用的加载性能问题集中大致三个：

- 初始加载，下载了大量的 JavaScript 文件
- 初始加载，下载了大量的 CSS 文件
- 初始加载，发送了太多的网络请求

而现在较多应用都是由 webpack 打包，而作者 Sean 给出来一个最终目标：

- <= 200 kb 的 JS 文件
- <= 100 kb 的 CSS 文件
- 最终应用依赖维持在 90% code coverage

其中如何查看应用code coverage可以查看，这篇[博客](https://github.com/baixiaoji/blog/issues/21)，搜索关键字：**如何查看页面中 CSS 和 JavaScript 使用情况？**

而前两个要求，就必须将文件尽量拆分打包成独立的chunk。PS：根据 workshop 记录，Sean 并不建议将 JS 文件打包成一个 bundle 文件。

code spliting 就能实现这个目标。code spliting 核心就是使用webpack 提供的 `import()`(动态import方法，PS：和ES module中的`import`是两个东西。)

而 code spliting 有存在两种方式：

- static
- dynamic

其实两种都是使用`import()`方法，只是 dynamic 方式的 import 文件是动态的路径。

而被`import()`的文件，最终会生成一个单独的chunk文件。而后应用使用到的那一刻，动态引入chunk文件。

想想思路应该是webpack最终会提供一个动态插入script标签的方法。bundle文件会有一个 `__webpack_require__.e`的方法，功能就是如此。

其中 static 的使用的场景有：

- 剥离体积较大的JS文件
- 适用于任何临时的引用使用
- Routes

Routes中，而在 Vue-Router 官方文档中 [Lazy Loading Routes](https://router.vuejs.org/guide/advanced/lazy-loading.html#grouping-components-in-the-same-chunk)其中同样记录可以使用 webpack 提供的 `import()`

其中 dynamic 的使用场景有：

- AB Testing / AB测试
- Theming / 主题
- Convenience （光看PPT琢磨不出来这种场景）

```javascript
const getTheme = (theme) => import('./src/theme/${theme}');

if (window.feeling.stylish) {
	getTheme('stylish').then(module => {
		module.applyTheme()
	})
} else if (window.feeling.trendy){
	getTheme('trendy').then(module => {
		module.applyTheme()
	})
}
```

其实看到这段代码的时候，会很好奇 webpack 会怎么处理的，毕竟这边存在 if 语句。

而后看了这个，原来webpack 根据 Partial Path(部分的路径)去找到当前目录将所有文件都打包成一个 chunk 文件。

![image-20200502110324235](https://i.loli.net/2020/05/02/nKIucBVYJXyeLoE.png)

magic comments 可以帮助我们自定义当前的chunk 文件最终打包出来的name，但是前提是 webpack配置中 chunkfilename属性有对应的配置。

因为自己先前在寻找优化的项目的时候，发现有一个解决方案是添加`<link rel="preload" href='path/file'>`。大致功能就是让浏览器预先加载文件，但是自己会一直困惑我怎么适配webpack，而后发现 magic comments 提供了一个是 webpackPrefetch 的属性。若设置里这个magic comment，webpack最终会将当前的JS文件写到 `index.html`中。

其中看到了 gitlab 有一个 [MR](https://gitlab.com/gitlab-org/gitlab-foss/-/merge_requests/18824) ，使用了会有对页面UX存在帮助。

