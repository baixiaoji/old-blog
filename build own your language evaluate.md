## Build own your language —— Evaluate

现在我们已经拿到了一棵抽象语法树，接下来我们需要将其转化为可执行的代码并且执行它。

在这之前，我们需要思考一件事情：为什么 JavaScript 进行很多的数学运算呢？

你会不假思索的回答：「因语言中内置了 Math 对象呀！」

那我们来思考一下，我们实现这门四则运算语言，是不是也要内置提供加减乘除这四个内置方法呢？

所以我们需要实现一下内置方法：

```javascript 
const all = (fn) => (...list) => list.reduce(fn);

const add = all((a, b) => a + b);
const subtract = all((a, b) => a - b);
const multipy = all((a, b) => a * b);
const divide = all((a, b) => a / b);
```

我们已经完成了核心的内置函数，而这些四个方法将是我们运行时所提供的环境中。接下来我们需要将 AST 转化成可执行的代码。

```javascript
const evaluate = (node) => {}
```

而`evaluate`方法中 node 的类型有三种: `CallExpression`、`Indentifier`、`NumberLiteral`和`StringLiteral`。

先来最简单的，如果节点类型是`NumberLiteral`，我们只需要返回其节点的`value`属性。

```javascript
if (node.value) return node.value;
```

而后我们来思考一下，若当前节点是`CallExpression`的类型，我们该如何处理?

`CallExpression`类型代码逻辑就是调用函数，那么首先我们可以通过节点的`name`属性拿到方法名，然后去内置环境中查看是否存在该方法；而后将节点的`arguments`中的每一项再次调用`evaluate`函数。我们分别来实现一下:

```javascript
// evaluate 函数中
if (node.type === 'CallExpression') return apply(node);

function apply(node) {
  // 获取内置函数
  const fn = enviroment[node.name];
  const args = node.arguments.map(evaluate);
  
  if (typeof fn !== 'function') {
    throw new TypeError(`${node.name} is not a function`);
  }
  
  return fn.apply(null, args);
}
```

或许你会忘记`Indentifier`类型节点，其实该类型节点也是语言内置一些环境变量，就比如说圆周率 PI。而我们实现的思路和实现`CallExpression`相同。

```javascript
// evaluate 函数中
if (node.type === 'Indentifier') return getIndentifier(node);

function getIndentifier(node) {
  if (enviroment[node.name]) return enviroment[node.name];
  throw new ReferenceError(`${node.name} is not define`);
}
```

到了这里，我们已经实现完了这门语言的所有细节，以及可以做到运行这门语言了。

我们可以将前面设计好的三个函数组装一下，但在那之前我们可以构建一个`pipe`函数帮助我们像流水线一样处理代码。

```javascript
const pipe = (...fnList) => (input) => fnList.reduce((result, fn) => fn(result), result);
```

而后我们将三个函数组装成一个函数：

```javascript
// parse-and-evaluate
const parseAndEvaluate = pipe(
	tokenize,
  parse,
  evaluate,
)
```

此时你便可以调用 parseAndEveluate 函数去执行`(add 1 2)`了。

什么？你说每一次都要手动调用一下不免觉得有点弱智。

好的，我们可以为其提供一个repl和命令行工具。