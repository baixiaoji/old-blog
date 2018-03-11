### 只因人群中多看了你一眼「不起眼的const」

很久之前遇见过这样的一个经典的面试题：

```javascript
const arr = [];
for(var i = 0; i < 3; i++){ // A
    arr.push(()=> console.log(i));
}
arr[1];
```

当然，解决的方法有很多种，说最简单的一种就是将 **for** 循环里面的 **var** 改为 **let** 。

记得上一次，超群学长问我为什么的时候，我只说了 **let** 的块级作用域，每一次的循环的时候会在 **A** 处创建新的变量…

而学长很不理解，那时候我也很尴尬的说：「就是这样的糊弄过去。」

直到我看到了她，发现我对她的理解过于肤浅了，于是有了今天这篇文章。

```javascript
const arr = [0,8,2,8];
for(const i of arr ){ // A
    console.log(i);
}
```

实习这么久，看到以前的业务代码，看到的更多的是 *line A* 出是 **let**。所以第一眼看到的时候，会很困惑，**为什么能用 const**。我们都知道 **const**  仅仅是让我们声明常量的关键字而已，而真的是这样的吗？

我们知道 ES6 有 **const/let** 代替原本的 **var** 。可学习新语法的过程中，自己仅仅把 **const** 定义像 **Math.PI** 常量的用途，而用 **let** 取代了 **var**。

当自己深入了解 **const/let/var** 之间的区别过后，自己变得更常用的居然是 **const**。

在 ES6 到来之前，我们知道 JavaScript 只有函数作用域，没有块级作用域这一说的。而**const**与**let**的到来实现了块级作用域，所以会出现这样的代码了：

```JavaScript
// before ES6
var a = 0;
console.log(a); // 0

// in ES6
{ // A
    const a = 0; 
}
console.log(a); // ReferenceError: a is not defined
```

后部分的代码一定会报错，因为a变量声明的地方仅仅在 *line A* 这个块级中。其实这一点就能解释文章一开始提及的问题了。

可仅仅这样，就选着将 *for..of* 循环里面的 *let* 改为 *const* 未免也太草率了，所以我们还是了解一下在JS中的 *for*循环。

> IterationStatement : `for` `(` LexicalDeclaration Expressionopt `;` Expressionopt `)` Statement

该节中，讲述了JS中 *for*循环怎样解释的。在《exploringjs》此书中我也找到了正确答案。

> `const` creates one immutable binding per iteration  

当然，并不说所有的for循环可以替换使用const了，一切的前提你要明白：

1. 明白当前迭代器作用
2. 是否想在块级作用域中操作变量

#### 拓展阅读

[9. Variables and scoping 高亮版](https://app.yinxiang.com/shard/s35/nl/8882519/46788277-f516-4268-81dc-5043a5ed5a14?title=9.%20Variables%20and%20scoping)
[Runtime Semantics: LabelledEvaluation](http://www.ecma-international.org/ecma-262/6.0/#sec-for-statement-runtime-semantics-labelledevaluation)

