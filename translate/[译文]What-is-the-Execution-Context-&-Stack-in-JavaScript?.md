## JavaScript中执行上下文和栈是什么？

译者/白小霁  [原文](http://davidshariff.com/blog/what-is-the-execution-context-in-javascript/)

本文我会深入的讲解js中的最基础的部分，Execution Context (执行上下文)。看完本文过后，你应该会对js编译器怎样解释执行，为什么函数和变量可以在声明之前使用以及他们的值是怎样决定的有一个清楚的认识。

### 什么是 Execution Context?

js代码在执行时，其环境是至关重要的，其环境可分为以下3种的一种：

- Global code — 代码执行第一时间存在的默认环境
- Function code — 无论何时执行流进入一个函数体中，就会产生
- Eval code — 代码在 eval 函数内执行

想必你也阅读过大量关于 scope (作用域)的文章，为了完成本文的目标，让文章阅读起来更容易去理解，我们一同将术语 `execution context` 看待为当前代码在运行的环境/作用域。说的够多了，我们看一个同时拥有全局和函数上下文的代码：![mage-20180401135649](http://davidshariff.com/blog/wp-content/uploads/2012/06/img1.jpg)

上图的代码没有任何特别的地方，上述有一个用紫色边框包裹的 global context 和三个不同的分别用绿、蓝、橘色边框包裹的 function context。只有一个可以从其他上下文访问的global context。

你可以有若干数量 function context，每一个函数被调用的时候创建了新的函数上下文，创建的私有作用域，其中任何申明的函数不能被当前函数作用域以外直接访问。在上面的例子中，一个函数可访问一个自身上下文之外的变量，但外面上下文不能访问变量或函数在里面上下文。为什么会这样？这个段代码到底是如何评估的？

### Execution Context Stack

在浏览器中的js解释器是单线程的，就是同时只能做一件事。而其余的action或是event会被排列进一个叫做 Execution Stack的栈中。下图就可以抽象的看看单线程栈：![mage-20180401141305](http://davidshariff.com/blog/wp-content/uploads/2012/06/ecstack.jpg)

当浏览器首先加载script的时候，它默认进入的是 global execution context。如果global code当中有调用函数，代码流进入函数的调用过程，会创建一个新的execution context并且将这个context推进exxcution stack的顶部。

如果你在当前函数里还调用了其他的函数，上诉同样的事情会发生。当执行流进入inner函数，创建一个新的执行上下文并推行执行栈的顶部。浏览器只会执行在执行栈顶部的执行上下文，一旦函数在当前执行上下文执行完毕，执行上下文就会从栈顶弹出，将控制权转移到下一个执行上下文。给大家展示一个递归函数的调用栈：

```javascript 
(function foo() {
    if(i === 3) {
        return;
    }else {
        foo(++i)
    }
}(0))
```

![mage-20180401142317](http://davidshariff.com/blog/wp-content/uploads/2012/06/es1.gif)

这一串代码调用了自己3遍，每次将i的值加一。每一次foo调用的时候，就创建了一个新的执行上下文。一旦上下文执行完毕，就弹出调用栈并将控制权转交给下一个，直到控制权重新交回 global context。

**关于记住调用栈有5个要点**

- 单线程
- 同步执行
- 1个全局上下文
- 若干个函数上下文
- 被每一个函数创建新的执行上下文，甚至他们自调。

### Execution Context in Detail

现在我们知道，每一次调用函数都会创建一个新的执行上下文。然而，在js的解释器中每一次调用一个执行上下文会有两个阶段：

1. **Creation Stage**【函数调用，但执行之前】
   - 创建一个作用域链
   - 创建变量、函数和arguments
   - 决定 this 的值 
2. **Activation / Code Execution Stage**
   - 赋值和执行代码

现在可以将执行上下文理解为一个拥有三个属性的对象：

```javascript
executionContextObj = {
    'scopeChain':{/* variableObject + all parent execution context's variableObject */},
    'variableObject': {/* function arguments / parameters, inner variable and function declarations */},
    'this': {}
}
```

### Activation / Variable Object [AO/VO]

executionContextObj是在函数被激活时候创建的，但是在真正函数执行之前。这就是上述说的第一阶段：Creation Stage。接下来，解释器通过扫描函数的传递进的参数/arguments，内部函数声明和内部变量申明创建executionContextObj。

##### 接下来解释器是怎样评估代码

1. 找到一些激活函数的代码
2. 在执行函数代码之前，创建一个 execution context
3. 进入 creation stage
   - 初始化作用域链
   - 创建变量对象
     - 创建 arguments object，检查上下文的参数，初始化变量名和值和创建引用拷贝
     - 扫描上下文中的函数申明
       - 把找到的函数，将其函数名作为variable object的属性名，将其值指向内存中引用地址。
       - 如存在已有的函数名，引用地址将会被后面的覆盖
     - 扫描上下文的变量申明
       - 把找到每一个变量，将其变量名作为variable object的属性名，将其值初始化我 undefined
       - 如存在已有的变量名，跳过这个继续扫描。
   - 决定 this 在上下文的值
4. Activation / Code Execution Stage:
   - 代码一行一行执行

看一个例子：

```javascript
function foo(i){
    var a = 'hello';
    var b = function privateB(){
        
    };
    function c() {
        
    }
}
foo(22)
```

当运行到 `foo(22)`，creation stage 大概长成下面这样：

```javascript
fooExecutionContext = {
    scopeChain: {...},
    variableObject: {
        arguments:{
            0: 22,
            length: 1
        },
        i: 22,
        a: undefined,
        b: undefined,
        c: pointer to function c()
    },
    this: {...}
}
```

正如你所见，在creation stage阶段仅仅处理定义属性名，并没有赋值，参数和arguments除外。一旦creation stage完成，执行流就进入 the activation / code execution stage 阶段，执行完之后整个执行上下文就成了这个样子：

```javascript
fooExecutionContext = {
    scopeChain: {...},
    variableObject: {
        arguments:{
            i: 22,
            length: 1
        },
        i: 22
        a: 'hello',
        b: pointer to function privateB(),
        c: pointer to function c()
    },
    this: {...}
}
```

#### 关于提升

你可以线上找到很多关于定义属于 hoisting的东西，结束变量和函数声明是被提升到函数作用域顶部。然而，没有仔细解释为什么会发生这样，还记得刚刚说到解释器创建activation object吗？这就能很简单的解释为什么，看看下面的例子：

```javascript
(function() {

    console.log(typeof foo); // function pointer
    console.log(typeof bar); // undefined

    var foo = 'hello',
        bar = function() {
            return 'world';
        };

    function foo() {
        return 'hello';
    }

}());
```

下面的这些问题是可以回答的：

1. 为什么我们可以访问 foo 在他创建之前？
   - 如果我们跟着 creation stage阶段，我们就能知道变量早就在activation / code execution stage阶段创建好了。所以当函数开始执行，foo已经在activation object创建好了。
2. Foo 被申明了两次，为什么foo是一个函数而不是undefined或是string？
   - 即使Foo申明了两次，可在creation stage阶段函数是比变量先成为activation object的属性的，如果属性名存在活动对象中，变量就会跳过此次申明。
   - 所以，foo函数的引用是第一个在活动对象上创建的，而当解释下解释道var foo，我们看到有foo属性名存在了，所以代码是不会做任何事并继续读下去。
3. 为什么bar是undefined？
   - bar是一个变量，仅仅赋值了一个函数而已，我们都知道在creation stage阶段一个变量初始化的值就是undefined。

### Summary

希望能帮到你更加理解解释器是如何解析你的代码的。同样让你清楚了解执行上下文为你之后不明白为什么代码出现这样的情况而提供思路。

你会认为了解解释器内在功能对理解js知识是重要的吗？是否觉得理解执行上下文能帮助你写更好的代码？

### Further Reading

- [ECMA-262 5th Edition](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)

- [ECMA-262-3 in detail. Chapter 2. Variable object](http://dmitrysoshnikov.com/ecmascript/chapter-2-variable-object/)

- [Identifier Resolution, Execution Contexts and scope chains](http://jibbering.com/faq/notes/closures/#clIRExSc)

  ​