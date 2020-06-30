## Elasticsearch Notes

这篇是整理记录，单不限于 Elasticsearch，会涉及部分 ELK 。

## What's Elasticsearch

Elasticsearch 是可海量存储的分布式搜索分析引擎，基于Lucene搜索引擎库的一层封装的REST API。

对全文搜索支持良好（且免费），在生产中使用场景更多是查询一些日志信息或是海量查询。而Kibana是其生态链的重要一环，其主要消费就是 Elasticsearch 存储的数据。

#### Compare with SQL database

简单总结一下：设计理念相同，只是叫法不同。

在 ES 中启动一个 ES 实例，这个实例就相当于数据库，表在 ES 中被称为索引 *Index*，行称为文档 *Document*，列称为字段 *Field* ，Schema 被称为 *Mapping* ，数据库中查询语句 SQL 在 ES 中有相应的 DSL 查询语句。

![](https://user-images.githubusercontent.com/21168366/79728840-1d7b4a00-8321-11ea-9d64-12aa263c3179.png)

像传统的关系型数据库，需要定义好每一个数据库的Schema而后才能插入数据，ES 是基于HTTP提供了一套 REST API 。

Document方面是以JSON格式的数据插入，ES会根据字段自动创建，表中并不会有主键和外键等概念，存储一个大的JSON对象。

## Install Elasticsearch

使用Java开发，所以需要自行安装Java。

以下是使用docker进行安装

```bash
docker pull elasticsearch:7.4.2
```

安装成功，启动容器

```bash
docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:7.4.2 
```

其意思是：向外暴露 9200 端口和9300端口，port 9200 是http协议，可以使用浏览器与ES交互（查询 节点信息和节点状态），port 9300 是 tcp 协议，es集群之间进行通讯使用。

启动成功，访问`http://localhost:9200/`即可访问ES集群信息。ES 提供了一个 Rest API `_cat`作为监控 ES 状态信息的接口（访问`http://localhost:9200/_cat/`即可）。

### Elasticsearch REST API

> 后续API基于 elasticsearch@7.x
>
> 版本 7 之后API存在一些变更（类型统一改成了_doc）

#### Index 操作 

将document插入index操作，行话 Index此处为动词

```
PUT class/_doc/1
{
  "name": "baiji",
  "gender": "male",
  "age": 23
}
```

若发现同样的数据，删除之前的document，更新成插入document，然后将_version+1，result为updated。

#### create 操作

解决若出现相同id之后，无法插入。

```
PUT class/_create/1
{
  "name": "baiji",
  "gender": "male",
  "age": 23
}
```

无法得知接下来的id，如何插入新的document，是否自动生产Id呢? 将方法给成POST

```
POST class/_create
{
  "name": "baixiaoji",
  "gender": "male",
  "age": 23
}
```

#### update 操作

```bash
POST class/_update/1
{
  "doc": {
  "age": 24  
  }
}
```

#### get 操作

使用 GET 命令，指定索引/类型/ID 就可以查询到相应的文档。我们存的数据都被包裹在 _source 字段中。

```bash
GET class/_doc/1
```

那无法知道id怎么办？

上面get查询出现一个问题，不知道id怎么办, es提供改了_search api

```bash
GET class/_search?q=name:baixiaoji
```

#### Bulk 批量操作

一条一条语句执行，对网络IO不友好，ES提供了Bulk API，支持批量插入数据，减少网络IO。

Bulk 支持 Index create update delete 操作。

```
PUT _bulk
{"delete":{"_index":"class","_id":"1"}}
{"index": {"_index": "class", "_id": "1"}}
{  "name": "baiji","gender": "male","age": 23}
{"create": {"_index": "class","_id": "2"}}
{  "name": "baixiaoji","gender": "male","age": 24}
{"_update": {"_id": "1", "_index": "class"}}
{"doc": {"age": 18}}
```

#### mget 批量读

```
GET _mget 
{
  "docs": [
    {"_index": "class", "_id": 1},
    {"_index": "class", "_id": "2"}
    ]
}
```

#### OR 或运算

```
GET class/_search?q=name:(baixiaoji OR baiji)
GET class/_search?q=name:baixiaoji baiji
```

#### AND 和运算

```
GET class/_search?q=name:(baixiaoji AND baiji)
GET class/_search?q=name:"baixiaoji baiji"
```

#### NOT 非运算

```
GET class/_search?q=name:(NOT baiji)
```

#### 两种查询 Term 和 Phrase

ES 在对某个字段进行查询时，会分为两种查询方式，Term 与 Phrase 。简单来说就是把文本查询条件看做是一个“词”，还是“多个词”。使用双引号就是Term查询，否则搜视Phrase查询。

#### 范围查询

```
GET class/_search?q=age:<24
GET class/_search?q=age:(>=18 AND <=23)
```

#### 通配符查询

```
// * 匹配 0 或 多个 字符
GET class/_search?q=name:bai*
// ? 匹配 0 或 1 各字符
GET class/_search?q=name:bai?iaoji
// 其实就是正则的使用
GET class/_search?q=name.keyword:/ziqi [0-9]{1} deng/
```

#### 分页

```
GET class/_search
{
  "from": 0, "size": 1
}
```

### Set Index Config

设置Index初始化的分片以及给每一个分配配置的副本数量

```
PUT /class1
{
  "settings": {
    "number_of_replicas": 1,
    "number_of_shards": 2  
  }
}

POST class1/_doc
{
  "name": "kevin",
  "gender": "male",
  "age": 23
}
```

## Install Kibana

如果想要利用Elasticsearch数据进行可视化编辑或是更好的使用，建议安装Kibana叠加使用。

docker 安装

```
docker pull kibana:7.4.2
```

启动kibana，并与 es 建立联系

```
docker run --link <容器ID>:elasticsearch -p 5601:5601 kibana:7.4.2
```

查看容器id

```
docker ps -a
```

启动完成`http://localhost:5601/`进行访问。

## Using docker-compose

分别启动Elasticsearch和Kibana过于麻烦，而且每一次都开两次命令行，输出太多命令，极易出错，使用 docker-compose便可配置一次，一个命令就搞定。

```yaml
# docker-compose.yml 
version: '2.2'
services:
  cerebro:
    image: lmenezes/cerebro:0.8.3
    container_name: cerebro
    ports:
      - "9000:9000"
    command:
      - -Dhosts.0.host=http://elasticsearch:9200
    networks:
      - es7net
  kibana:
    image: docker.elastic.co/kibana/kibana:7.4.2
    container_name: kibana7
    environment:
      - I18N_LOCALE=zh-CN
      - XPACK_GRAPH_ENABLED=true
      - TIMELION_ENABLED=true
      - XPACK_MONITORING_COLLECTION_ENABLED="true"
    ports:
      - "5601:5601"
    networks:
      - es7net
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.4.2
    container_name: es7_01
    environment:
      - cluster.name=eslearn
      - node.name=es7_01
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - discovery.seed_hosts=es7_01,es7_02
      - cluster.initial_master_nodes=es7_01,es7_02
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - es7data1:/usr/share/elasticsearch/data
    ports:
      - 9200:9200
    networks:
      - es7net
  elasticsearch2:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.4.2
    container_name: es7_02
    environment:
      - cluster.name=eslearn
      - node.name=es7_02
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - discovery.seed_hosts=es7_01,es7_02
      - cluster.initial_master_nodes=es7_01,es7_02
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - es7data2:/usr/share/elasticsearch/data
    networks:
      - es7net
volumes:
  es7data1:
    driver: local
  es7data2:
    driver: local

networks:
  es7net:
    driver: bridge
```

服务有 cerebro 用来监控 ES 健康状态的，kibana 是 ES 的可视化图像界面，elasticsearch 则是就是 ES。

建议去一个目录中创建`docker-compose.yml `文件，然后在对应的目录下如下第一个命令：

```bash
# 启动命令
docker-compose up  
# 取消命令
docker-compose stop
```

后续访问：

1. localhost:5601 进入kibana界面
2. localhost:9000 进入 cerebro界面，监控ES状态

搞定上述配置之后，你就可以快乐玩耍了。什么你不知道Kibana怎么玩？