## 排序算法

### 算法

有零个或以上输入

一个或以上输出

明确性（描述无歧义）、

有限性（步骤有限）、

有效性（能够被执行者实现）

书：《数据结构与算法分析——C语言描述》

遇见思路障碍怎么办？

1. 将 `抽象的问题 `转化为 `具体问题`
2. 将 `没见过的问题`转化为`见过的问题`

## 排序

### 冒泡排序：「教官双手算法：较高的往后排」

都要循环，次数是一次比一次少一个

````javascript
function sort(array){
  var i,j
  for(i=0; i<array.length; i++){ // 第i次
    for(j=0; j<array.length-1-i; j++){ //每一次的起点
      if(array[j] <= array[j+1]){
        
      }else{
        swap(array,j,j+1)
      }
    }
  }
  return array
}

function swap(array,a,b){
  var temp = array[a];
  array[a] =array[b]
  array[b] = temp
}

console.log(sort([3,5,2,4,1]))
````



### [选择排序](http://js.jirengu.com/bewe/3/edit?js,output)：「教官一指算法：最矮到前面来」

```javascript

function sort(array){
  var i
  var j
  var indexOfMin
  for(i=0; i<array.length; i++){
    indexOfMin = i
    for(j=i+1; j<array.length; j++){
      if(array[j] < array[indexOfMin]){
        indexOfMin = j
      }
    }
    // 观察 刚开始的 i 是否就是 indexOfMin
    if(indexOfMin !== i){     
      // 将最小的交换到本次循环的开始
      swap(array, i, indexOfMin)
    }
  }
  return array;
}

function swap(array, a,b){
  var temp = array[a]
  array[a] = array[b]
  array[b] = temp
}

console.log(sort([3,5,2,4,1]))
```



### 插入排序：「起（理）牌算法」

### 归并算法：「领导算法」

用到递归，从最底层开始运行

### 快速排序：「自私算法：我前面的都比我矮，我后面的都比我高」

也是递归，但是有记住一些索引  次数对半的，但是有一个不好的地方是：如果这个已经派好了，就相当于是冒泡排序

### 随机快速排序

### 桶排序

前提是知道当前的数的范围，需要一个额外的数组还存东西

### 