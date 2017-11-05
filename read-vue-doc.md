## 数据响应的原则
实例化出来的对象，直接增加的属性（数据），是不会响应的。只有在实例被创建的时候`data`中的属性是响应式的，也就是说只有一开始的`data`里面的数据是响应式的，当然还有另一种在实例出来定义是可以的。
```JavaScript
const app = new Vue({
    ...
    data:{
        a:1
    }
})
app.b = 2   // 这里是不响应的
Vue.set(app,b,2) //这里出可以响应的
//Vue.set(object, key, value)
```

## 表达式与语句的区别
《你不知道的JavaScript（中卷）》语法篇里面有。

## 何时使用计算属性？
文档给出任何复杂逻辑都应该使用计算属性？
计算属性 vs 方法 vs 监听者
计算属性是有**缓存**的信息，只有依赖数据没要发生变化，下一次渲染就调用函数`return`数据
```JavaScript
new Vue({
  computed:{
      reversedMessage: function () {
          return ...
      }
  },
  methods:{
      reversedMessage: function(){
          return ...
      }
  },
  watch:{
      Message:function(val){
          this.reversedMessage = val.split('').reverse().join('')
      }
  }
})
```
## [v-if vs v-show](https://cn.vuejs.org/v2/guide/conditional.html)


## [key的作用](https://cn.vuejs.org/v2/guide/list.html#key)

## 对事件处理的  系统修饰键   `.exact`修饰符的触发有很大的puzzle😵
[jsbin链接](http://jsbin.com/dubegedadi/2/edit?html,console,output)

