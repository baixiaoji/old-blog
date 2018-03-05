#### git 操作收集

git mv  

将暂存区的文件修改名字，并且再次提交到暂存区可以替换了

mv   && git add && git commit 

##### 显示提交信息的

git log  --stat

显示之前端操作记录以及统计在那些文件进行修改，包括修改的行数等信息

git log --pretty=[option]

Option oneline | full | fuller |short | format

[Format-一些参数](https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E6%9F%A5%E7%9C%8B%E6%8F%90%E4%BA%A4%E5%8E%86%E5%8F%B2#rpretty_format)

git log  --since=    2.days / 1.weeks 
git log  --until=    2017.12.31

可以展示时间段的所有的提交信息

###### 展示缩写的SHA-1的commit

git log —abbrev-commit —oneline

###### 展示某一个快照的操作记录

git show <SHA-1>

###### 查看某个分支当前对应的那个SHA-1

git rev-parse <branch_name>

Git show <branch_name>

###### 查看当前分支比别的分支差几个commit

查看远程master与本地feature2上差几个分支

git log  origin/master..feature2

看到只有一方拥有的commit

git log origin/master…feature2

这时候就要分不清哪个commit是哪条分支上的了

git log —left-right origin/master…feature2

##### 修改commit

git commit —amend

忘记本次提交的信息或是message 错误，可以使用这次再次提交

##### 远程仓库

git remote show <remote-name>

查看远程仓库的所有信息

##### 打标签

git tag  查看标签

标签分为 轻量标签和附注标签

###### 附注标签的创建方法：

git tag -a <tag_version>  -m <explain_message>

创建附注标签的-m的信息是必须添加的，如果没有手动添加是不容许的

查看对应的标签的方法： git show <tag_version>

显示的信息较多，包含打标签的作者，打标签的附注信息，时间以及提交的commit

###### 轻量标签的创建方法

git tag <tag_version>

不用增加什么附注的信息

上传的标签到服务器的操作

git push origin <tag_version>

git push origin --tags
可以将标签打到服务器上

###### git alias的一些书写方法

git上的命令并不会自动补全，而且作为一个「懒惰」的程序员而言要有快速的命令行技巧会帮助起快速完成一些任务

git config —gobal alias.last 'log -1 HEAD'

###### 创建分支

git checkout -b <branch_name>

等同于

git branch <branch_name>
git checkout <branch_name>

###### 删除本地分支

git branch -d <branch_name>

###### 删除远程分支

git push origin —delete <branch_name>

###### 查看每一条分支最后一次的提交

git branch -v

###### 查看每一条分支最后的提交以及对应的上流分支

Git branch -vv

###### 查看那些分支合并过

git branch --merge

###### 查看那些分支没有合并过

git branch —no-merged

###### 储藏 stash

情境：突然接收到hotfix的命令，但是当然没分支做过一些修改，把修改藏起来

git stash  / git stash save

查看stash的列表

git stash list

取出藏起来的修改  有index参数的是回到你原来放进去的状态

git stash apply / git stash apply —index

删除stash列表里面的stash

git stash drop stash@{n}

###### 搜索的方法

情境：想查看一些方法在文件的哪里出没过

git grep -n —count xxx

###### 拉取的不同

git fetch vs git pull

fetch是把远程上本地没有的数据拉取下来，但是让用户手动去合并这些内容，而 pull 的操作更像是 先fetch在merge的效果

###### 关于子模块的命令

git add submodule URL

克隆一个包含子模块的项目，子模块是空目录，需要用以下几个命令

git submodule init  && git submodule update

或是克隆的时候，带上应有的参数

git clone recursive url

更新子模块的，自动合并到本地

git submodule update --remote
