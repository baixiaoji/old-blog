## 如何在作用域链中找到闭包

[原文](http://davidshariff.com/blog/javascript-scope-chain-and-closures/#first-article)

在[上文](./[译文]What-is-the-Execution-Context-&-Stack-in-JavaScript?)，我们知道每一个函数都要一个与之对应的`execution context`，改执行上下文中包含一个拥有该函数所有变量的变量对象。

每一个执行上下文中都有一个作用域链，其中包含了当前上下文的变量对象和所有父级词法的变量对象。

> Scope = VO + All Parent VOs
Eg: scopeChain = [ [VO] + [VO1] + [VO2] + [VO n+1] ];

### Determining a Scope Chain’s Variable Objects [VO]s

作用域链中第一个 VO 就是当前执行上下文，同样能在作用域链中找到父级的 VO。
```Javascript
function one(){
    two();
    
    function two(){
        three();
        
        function three(){
            alert('I am at function three');
        }
    }
}

one();
```
![上面的调用栈](http://davidshariff.com/blog/wp-content/uploads/2012/06/stack14.jpg)
上面的运行结果：会触发了「I am at function three」这句话，上图也说明了对应的调用栈的情况，但是看到这一个时间点下的作用域链时怎样的：

> three() Scope Chain = [ [three() VO] + [two() VO] + [one() VO] + [Global VO] ];

### Lexical Scope

JS 使用的是词法作用域，与之对应的则是动态作用域。所有的函数都作用域完全取决于代码卸载整块代码的哪一个地方。

上面的例子中，连续调用内部函数是没有关系的。因为 three() 总是和 two() 绑定的，同样两者也与 one() 绑定了。 生成了一种链式作用使得内部的函数通过静态绑定的作用域链可以访问外部函数的 VO。

词法作用域是许多开发者困惑的源头。我们知道每一个执行的函数会创建一个新的执行上下文和关联一个收集了当前上下文中所有变量的 VO 。

是否感觉这充满变化呢？ 每一个上下文中由静态定义好的成对的 VO 对象组成，可有时候会给我们造成意料之外的结构。一起看看这个经典的案例:

```Javascript
var myAlerts = [];

for (var i = 0; i < 5; i++) {
    myAlerts.push(
        function inner() {
            alert(i);
        }
    );
}

myAlerts[0](); // 5
myAlerts[1](); // 5
myAlerts[2](); // 5
myAlerts[3](); // 5
myAlerts[4](); // 5
```

第一眼看，我们会以为改函数会依次输出 1，2，3，4，5。

这就是困惑的普遍观点。inner函数是在全局上下文中创建的，因此他的作用域链就与全局上下文绑定了。

看上述执行的inner()，就会去inner.ScopeChain中找i，直到在全局上下文的变量对象中找到了 i ，而在这个时候 i 已经为 5 了。

### Resolving the value of variables

在看看下面的例子：
```Javascript
function one() {

    var a = 1;
    two();

    function two() {

        var b = 2;
        three();

        function three() {

            var c = 3;
            alert(a + b + c); // Line A

        }

    }

}

one();
```
Line A 会有点奇怪，因为a和b根本没有在three函数中申明呀！所以这样的代码会生效吗？ 为了理解解释器是如何评估这段代码的，我们需要看一下当 three 函数执时它的作用域链时怎样的：
![three函数的作用域链](http://davidshariff.com/blog/wp-content/uploads/2012/06/scopechain1.png)

当解释器执行到了`alert(a + b + c)`，它依次在作用域链中查找对应的变量的值，如果当前没有就找下一个，直到找不到抛出`ReferenceError`。

### How does this work with closures?

JS中，闭包往往作为一个高级工程师才能完全理解的技能，可从原型链中理解就变得简单起来。首先看一下 Crockford 是如何定义闭包：
> An inner function always has access to the vars and parameters of its outer function, even after the outer function has returned…

下面的代码就是一个闭包：
```Javascript
function foo() {
    var a = 'private variable';
    return function bar() {
        alert(a);
    }
}

var callAlert = foo();

callAlert(); // private variable
```

全局有一个 foo 函数和 callAlert 变量。
令人吃惊的事为什么当 foo 函数执行完了还能访问私有变量 a 呢？

那让我来看看与之对应的上下文吧

```Javascript
// Global Context when evaluated
global.VO = {
    foo: pointer to foo(),
    callAlert: returned value of global.VO.foo
    scopeChain: [global.VO]
}

// Foo Context when evaluated
foo.VO = {
    bar: pointer to bar(),
    a: 'private variable',
    scopeChain: [foo.VO, global.VO]
}

// Bar Context when evaluated
bar.VO = {
    scopeChain: [bar.VO, foo.VO, global.VO]
}
```
这里我们看到 bar 函数的作用域链集成了所有的上下文中的变量对象，所以当 bar 函数执行时候，会去原型链上查找 a 变量，一个一个找下去，找到后在将对应的值返回给当前的上下文中，继续将函数执行下去，及时foo函数已经执行完了，说明每一个作用域链是自己变量对象和所有父级的变量对象的集合，并且父级变量对象是赋值所得，以至于为什么父级函数执行完毕还能访问对应的私有变量，同样解释了为什么会时词法作用域。

上述已将覆盖了作用域链和词法环境，解释了闭包和查找变量是怎样形成。文章接下来的部分会讲述一些关于涉及点的有趣场景。

### Wait, how does the prototype chain affect variable resolution?

JS是继承原型继承，其中除了null和undefined之外全是对象。当我们去访问对象的一个属性的时候，解释器会首先去判断该属性是否存在在这个对象上。如果没有找到对应的属性，就会去原型链上查找直到找到属性或是找到了原型链的终点。

这样会有一个有趣的问题，那解释器是优先使用作用域链还是原型链呢？两者都会。当时找对应的属性时，作用域链会找到对应的对象，而通过原型链找到对应的属性，我们康一下这个例子：
```Javascript
var bar = {};

function foo() {

    bar.a = 'Set from foo()'; // Line A

    return function inner() {
        alert(bar.a);
    }

}

foo()(); // 'Set from foo()'
```
Line A 中给全局对象 bar 增加了一个属性。解释器通过作用域链在全局上下文中找到了 bar.a 。接下来试试这样：

```JavaScript
var bar = {};

function foo() {

    Object.prototype.a = 'Set from prototype';

    return function inner() {
        alert(bar.a);
    }

}

foo()(); // 'Set from prototype()'
```

运行时，触发了inner函数，为了找到了 bar.a 的值，通过作用域链找到了全局上下文中的 bar 对象，于是开始查看 a 属性，然而 bar 上并没有 a属性，于是解释器通过对象的原型链查找，直到找到 a 属性。
这样的行为解释了标志符的解决方案。通过作用域链找到了对象的准确位置，在通过对象的原型链查找对应的属性直到找到或是返回 undefined 为止。

### When to use Closures?

闭包是JS中最NB的概念。

#### Encapsulation (封装)

可以帮助我们隐藏部分实现功能的细节，将需要暴露的公共接口暴露出来。这是模块设计的方式之一。

#### Callbacks (回调)

使用最多闭包的就是回调。JS时单线程的事件循环，如果一个事件没有停止则会阻塞其他的事件。回调会允许我们稍后触发一个函数。
> typically in response to an event completing, in a non-blocking manner. An example of this is when making an AJAX call to the server, using a callback to handle to response, while still maintaining the bindings in which it was created.

#### Closures as arguments (将闭包作为参数)
我们同样可以将闭包作为一个参数传入函数，这样可以构造一个更加复杂功能函数。
> Take for example a minimum sort function. By passing closures as parameters, we could define the implementation for different types of data sorting, while still reusing a single function body as a schematic.

### When not to use Closures ?

我们知道闭包很NB，但不能滥用。

#### Large scope lengths

大量嵌套函数则是一个典型的造成性能问题的例子。记住，每一次你去计算变量的时候，作用域链必须找到对应的变量，所以如果函数嵌套过多，查找对应的变量的时间就会变长。

#### Garbage collection

JS是一门垃圾回收的语言，意味着开发者并不会过于在意内存的管理。然而自动的垃圾回收会让开发者遇见低性能还内存泄露的情况。

不能的JS引擎实现垃圾回收的机制略微不同。但是其目的都是创建一个高性能并没有泄露的引擎。总体而言，垃圾回收会释放那些没有被引用的对象，而依旧被引用的对象则不被释放。

#### Circular references

如果代码中存在环状引用的话很极有可能造成内存泄露，请记住内部函数只能引用那些存在与外部作用域链中的变量。虽说现在引擎性能较好，保不齐你会遇见该死的IE，即使可能性较低，但怎开发中还出要思考不要环状引用。
什么时环状引用？
> it is a term used to describe a situation where one object references another object, and that object points back to the first object

老IE中，如果你引用DOM元素会造成内存泄露。因为IE使用的JS引擎和DOM时两套独立的垃圾回收机制。所以引用DOM元素，原生的收集者处理了DOM，但是DOM收集者重新指向给了原生，结果造成了环形引用。

### Summary

在过去多年的工作当中，我发现对于原型链和闭包的概念仅仅知道点皮毛，并不了解其细节。所以我希望透过该文帮助你更加深入了解这些基础概念。

接下来，你掌握了需要知道的知识，并在编码中知道了在任何情况下如何查找变量的方法。
> Happy coding !