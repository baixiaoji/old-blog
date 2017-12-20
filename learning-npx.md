## [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) 是一个好东西

避免全局安装

### 一次性的代码

可以执行cli的包，如果没有安装就会自动下载

### 可以使用不同版本的node包 

```bash
npx -p node@X
```

不用`nvm` `nave` 或是`n`去控制node的包管理工具，只要安装`npm@5.2.0`就足够了。

方便测试自己发布的包能不能在不同的node环境下使用

### npm scripts进行交互



### 可以直接运行gist的代码

<https://gist.github.com/zkat/4bc19503fe9e9309e2bfaa2c58074d32>

运行的感觉很像运行`.sh`script一样

#### 多写一次npx，解决方案

在自己的shell里面配置好

```bash
source npx --shell-auto-fallback shellname 
```


