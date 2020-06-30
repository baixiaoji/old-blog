## From Genetic Tree to Binary Search Tree

一开始自己处理数据类型的时候，对树形结构的数据比较惧怕，主要就是害怕需要自己去做遍历加工处理的工作。

现在我们来看看树这种树结构，顺带实现一个树呗。

### 节点 Node

一棵树最基本的单元就是树上的节点，而这个节点通常情况下拥有两部分信息：1. 自身数据信息；2. 存储后续子代的信息。

![节点数据类型](https://i.loli.net/2020/05/26/TZ3DrtovsOeGqIl.png)

而每一个节点都拥有 `push` 和 `remove` 的方法，前者是将增加子代节点，后者是删除子代节点。

大致知道了以上的信息，我们便可以实现一个 Node 。

```javascript
class Node {
  constructor(data) {
    this.data = data;
    this.children = []
  }
  
  push(val) {
    const node = new Node(val);
    this.children.push(node)
  }
  
  remove(val) {
    this.children = this.children.filter(node => node.data !== val);
  }
} 
```

接下来要来的就是重头戏了，如何实现 Tree 呢？

### 通用树 Genetic Tree

我们想想一棵树是怎样的，是不是也是存在一个root节点？这个 root 节点是不是就是和我们上面实现 Node 那样的？

当然答案是一定的，树存在一个 root 节点，而这个 root 节点说白了也是一个 Node 类型的节点，所以他拥有自身数据信息和后代的关联信息。

上面的信息我们大致可以解决 Tree 方法的定义了。代码如下：

```javascript
class Tree {
	constructor() {
		this.root = null;
	}
}
```

那我们开始思考文章开头留下的问题，如何遍历一个树状结构。我们来实现遍历的方法给上层的开发者，避免他们的恐惧吧。

#### 遍历 Traversal

说到树的遍历，存在两种遍历方式：

1. BFT （Breath Fist Traversal）广度优先遍历
2. DFT （Deep Fist Traversal）深度优先遍历

##### 广度优先遍历 BFT

![BFT](https://i.loli.net/2020/05/26/ezGuSDAyVrQjUIJ.png)

广度优先遍历的方式是：每当遍历完了每一层节点，我们才进行下一层级节点的遍历。

我们可以这样实现：创建一个数组，然后将 root 节点放在改数组中；然后开始循环，如果数组长度不为零，则拿到数组中的第一项，第一项若存在子代则将子代推进数组，然后将当前节点转交给调用者的回调处理。

```javascript
class Tree {
	//...
	traversalBF(callback) {
		const arr = [this.root];
    while(arr.length) {
      const node = arr.shift();
      arr.push(...node.children);
      callback(callback);
    }
	}
	//...
}
```

##### 深度优先遍历 DFT

![DFT](https://i.loli.net/2020/05/26/GNxOEksrofStivA.png)

深度优先遍历的方式是：只有当前节点存在子代，优先遍历完当前子代节点。

实现的思路和BFT模式几乎相同，就是子代推进数组的位置不同，这时候需要将子代推进数组的开头。

```javascript
class Tree {
	//...
	traversalDF(callback) {
		const arr = [this.root];
    while(arr.length) {
      const node = arr.shift();
      arr.unshift(...node.children)
      callback(node);
    }
	}
	//...
}
```

以上完成了通用树的遍历情况了。

### Binary Search Tree

目前理解中二叉搜索树是最有意思的二叉树的一种。其主要特性是：当前节点的值是大于左节点，小于右节点的。

![binary-search-tree](https://i.loli.net/2020/05/31/4sfvT9et2PxwGgZ.png)

也正因为这样的特性，所以在这种类型的书中进行搜索的值的的时候，二分查找的思路就体现的淋漓尽致了。

同样我们根据先前的思路一样，我们来实现一下二叉搜索树吧。

```javascript
class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}
```

节点拥有两个方法，一个是 insert （插入新节点），另一个是 contains （包含某节点）。

即便是二叉搜索树，树上每一个节点都是会拥有上述的两个方法，再结合二叉树的特性我们可以很容易找到插入或是寻找方向。

```javascript
class Node {
	//...
  insert(data) {
    if (this.data > data) {
      // 往左边查找
      if (!this.left) {
        this.left = new Node(data);
      } else {
        this.left.insert(data);
      }
    } else  {
      // 往右边查找
      if (!this.right) {
        this.right = new Node(data);
      } else {
        this.right.insert(data)
      }
    }
  }
  
  contains(data) {
    if (this.data === data) {
      return this;
    } else if (this.data > data && this.left) {
      this.left.contains(data);
    } else if (this.data < data && this.right) {
      this.right.contains(data);
    }
    return null;
  }
}
```

而如何校验一棵树是符合二叉搜索树呢？

整体的思路就是创建两个变量（min和max）；若节点往左去遍历的时候，将max设置为上一个父节点，查看左子树上的节点是否存在数值比max还大的值；若节点往右子树方向去遍历，将min设置为上一个父节点的字，去比较这边树节点是否都比min大。

```javascript
function validate(node, min = null, max = null) {
  if (max !== null && node.data > max) return false;
  if (min !==null && node.data < min) return false;
  if (node.left && !validate(node.left, min, node.data)) return false;
  if (node.right && !validate(node.right, node.data, max)) return false;
  
  return true;
}
```

当然以上仅仅是对树类型的数据结构进行的简单的介绍和阐述，整个方面还有很多需要探索的知识点。