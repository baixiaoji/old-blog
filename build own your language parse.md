## Build own your language —— Parse

前面我们已经完成了 tokenize 的过程，已经获得了已知的 token 数组，而此时的 token 数组是没有规律的，所以我们需要通过 parse 过程将 token 根据语法规则转化为解析树的形式。

我们语法很简单，就是读取到**括号()**的 token 时候，就可以去除掉**括号()**,然后重新整合 token 数组。

因为需要频繁查看和取出 token 数组第一项。我们可以封装`pop`和`peek`这两个工具函数。

```javascript
const pop = (arr) => arr.shift();
const peak = (arr) => arr[0];
```

现在我们开始第一次处理 tokenize 返回的数组，根据我们的先前定义的语法整合token 数组。

```javascript
const parenthesize = (tokens) => {
	const token = pop(tokens);
  if (isOpenParenthesis(token.value)) {
    const expression = [];
    
    while(!isCloseParenthesis(peek(tokens).value)) {
      expression.push(parenthesize(tokens)) // A
    }
    // 剔除 close Parenthesis ) 
    pop(tokens)
    
    return expression;
  }
  return token;
}
```

这里让人有点困惑的就是 A 行代码。这边使用了递归方式去将 tokens （已经少了少了起始括号 ）重新代入 parenthesize 函数去取值。

现在我们将剔除 了tokenize中无意义的token，通过 parenthesize 函数根据语法将重新整理了token结构。现在需要将token转化成抽象语法树。

我们需要一个parse函数。

```javascript
const parse = (tokens) => {}
```

我们需要考虑一下 tokens 可能的情况：

1. 单个 token， 其type属性值可能会是 Number、String、Name
2. 数组的情况，实质就是函数调用的情况，经过parenthesize方法输出一个新的 token 数组

实现第一种情况,，判断类型返回对应节点信息：

```javascript
if (token.type === 'Number') {
  return {
    type: 'NumericLiteral',
    value: token.value,
  }
}

if (token.type === 'String') {
  return {
    type: 'StringLiteral',
    value: token.value,
  }
}

if (token.type === 'Name') {
  return {
    type: 'Identifier',
    name: token.value,
  }
}
```

实现第二种情况：

```javascript
if (Array.isArray(tokens)) {
	const [first, ...rest] = tokens;
	return {
		type: 'CallExpression',
		name: first.value,
		arguments: rest.map(parse),
	}
}
```

大致思路就是若是数组，则将其转化为 CallExpression 类型的对象，而后将其后续每一项进行递归调用`parse`函数。

此刻，我们已经完成了将token转化为抽象语法树的过程了。下一步就是根据抽象语法树进行 evaluate，就是执行代码咯。

