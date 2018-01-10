## [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) 是一个好东西

- 可以执行依赖包的二进制文件，使用本地命令行工具不需要`npm scripts`
- 执行一次性命令（多半是cli的包）
- 不用node版本管理工具
- 直接运行gist的代码
- 避免全局安装，想用就用

> Executes `<command>` either from a local `node_modules/.bin`, or from a central cache, installing any packages needed in order for `<command>` to run.

不择手段让命令跑起来！

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

想要链接到自己公司的仓库

—userconfig 

https://github.com/zkat/npx/issues/133

```Bash
echo "@mycompany:registry=https://my.companies.private.registry/" >> ~/.npmrc
```



