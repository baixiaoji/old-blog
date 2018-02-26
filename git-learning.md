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

###### 拉取的不同

git fetch vs git pull

fetch是把远程上本地没有的数据拉取下来，但是让用户手动去合并这些内容，而 pull 的操作更像是 先fetch在merge的效果
