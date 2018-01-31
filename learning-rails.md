[TOC]

# Rails
## 前提

1. 最好是 unix 的系统
2. 安转 Ruby > 2.2.2 
3. SQLite3

可以使用 homebrew 去安装这些东西。

## 创建应用

> Rails 提供了很多的生成器(generate)的脚本，而这一些的脚本可以韦特快的任务生成所需的全部文件，从而简化开发。
> 这里的 new 就是一个generate 
```bash
rails new blog
```

## 启动服务
当整个项目新建完成过后，可以在终端输入这行脚本
```bash
bin/rails server
```

## hello Rails
> 要让 Rails 显示“Hello, Rails!”，需要创建控制器和视图。

控制器： 对应若干路由，并针对对应的路由去获取数据。
视图：仅仅负责显示数据。
> 默认情况下，视图模板使用 eRuby（嵌入式 Ruby）语言编写，经由 Rails 解析后，再发送给用户。

可以用控制器生成器来创建控制器。

```bash
bin/rails generate controller Welcome index
```

上面的命令告诉控制器生成器创建一个包含“index”动作的“Welcome”控制器。

创建了许多的文件，但是里面最重要的文件就是控制器和视图。

控制器：**app/controllers/welcome_controller.rb**

视图： **app/views/welcome/index.html.erb**

将视图里面的代码，修改为`<h1> Hello, Rails</h1>`，同时去配置**config/routes.rb**文件

````ruby
Rails.application.routes.draw do
  get 'welcome/index'
 
  root 'welcome#index'
end
````

> `root 'welcome#index'` 告诉 Rails 对根路径的访问请求应该发往 welcome 控制器的 index 动作，`get 'welcome/index'` 告诉 Rails 对 <http://localhost:3000/welcome/index> 的访问请求应该发往 welcome 控制器的 index 动作。后者是之前使用控制器生成器创建控制器（`bin/rails generate controller Welcome index`）时自动生成的。

跑完以上的东西，就可以将一个rails项目，慢慢跑起来了。

-------






