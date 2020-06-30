## Build own your language —— Tokenize

自己对一门语言是抱有好奇的。

实质上好奇的是：如何设计一门语言。然而设计一门语言是相对简单的，大致就是设计好一系列的语法规则，然后使用者根据语法规则进行书写便可。

那如果将这个思路移植到计算机语言中也是如此吗？我想大致的方向是相同的，只不过更多是一些细节上的处理。

那我们来设计一门语言中，首先我们写定一下大致的规则约束：

```javascript
// 1. 类型支持
// Number 和 String

// 2. 语言会有内置一些方法
// 如 add subtract mutiply divide

// 3. 函数调用方式
// (<buildin_function_Name> arg1 arg2)
// eg (add 1 2) // 3
```

我们定义好了大致的规范之后，我们便要一步一步去实现这门语言了。

就像浏览器接受了 HTML 文件之后会交给 HTML Interpreter 进行处理 HTML 文件。

而解析整个过程的第一步就是将源代码进行词法分析，将文档转化为有效的标记，而改过程就是 Tokenize 。

### Tokenize

在写整个 tokenize 逻辑之前，我们可以根据我们先前的语法规则，写一些识别字符类型的帮助函数。

```javascript
const LETTER = /[a-zA-Z]/;
const WHITESPACE = /\s+/;
const NUMBER = /^[0-9]+$/;


const isLetter = character => LETTER.test(character);

const isWhitespace = character => WHITESPACE.test(character);

const isNumber = character => NUMBER.test(character);

const isOpeningParenthesis = character => character === '(';

const isClosingParenthesis = character => character === ')';

const isParenthesis = character =>
  isOpeningParenthesis(character) || isClosingParenthesis(character);

const isQuote = character => character === '"';
```

虽说解析整个文档，但是实际上我们处理的只是一个字符串，然后返回一个有效标记的数组便可。既然确定了函数的输出和输出，我们就可以写出下面逻辑了。

```javascript
const tokenize = (input) => {
	const tokens = [];
	// ...
	return tokens;
}
```

而我们需要做其实就是遍历 输入，所以我们需要一个  `cursor` 变量帮助我们记录当下被遍历的字符串索引，所以我们添加如下代码：

```javascript
const tokenize = (input) => {
	const tokens = [];
	const cursor = 0;
  
  while(cursor < input.length) {
    const character = input[cursor];
  	// do staff
  }
	return tokens;
}
```

而我们来思考一下，字符串中会遇见那些「类型」，大致就是：空格、括号()、函数名称（内置函数名字）、数字、字符串。

先写简单的两种类型判断，如下：

```javascript
// 空格
if (isWhitespace(character)) {
	cursor++;
  continue;
}
// 括号()
if (isParenthesis(character)) {
	tokens.push({
  	type: 'Parenthesis',
    value: character,
  })
  cursor++;
  continue;
} 
```

那其余三种类型判断，思路都是相同，一旦判断到了第一个字符串符合类型，就需要往后继续进行遍历判断，直到下一个字符串不符合判断类型即可。

```javascript
// 函数名称（内置函数名字）
if (isLetter(character)) {
  let fnName = character;
  
  while(isLetter(input[++cursor])) {
    fn += input[cursor];
  }
  
  tokens.push({
    type: 'Name',
    name: fnName,
  })
  
  continue;
}
// 字符串
if (isQuote(character)) {
	let string = '';
  while (!isQuote(input[++cursor])) {
    string += input[cursor];
  }
  tokens.push({
    type: 'String',
    value: string,
  });
  cursor++;
  continue;
}
// 数字类型
if (isNumber(character)) {
  let numberString = '';
  while (!isQuote(input[++cursor])) {
    numberString += input[cursor];
  }
  tokens.push({
    type: 'String',
    value: numberString,
  });
  cursor++;
  continue;
}
```

当然为了逻辑的严谨性，你可以tokenize最后加上一个报错机制，如下:

```javascript
throw new Error(`${character} is not valid`);
```

这样tokenize的工作就搞定了。回顾一下整个流程就是：接受了一个字符串，然后通过遍历每一个字符串是否符合内置类型，若符合打包成一个token存入tokens数组中，完成一系列识别工作，输出 tokens 数组，交给后续parse流程。