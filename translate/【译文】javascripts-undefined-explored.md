## JavaScript’s Undefined Explored

这个看起来是一个简单的概念，但你如何检验一个变量和属性在JS中是否存在？那种实践办法是最好的解决方案呢？我们怎样能考虑到边际情况呢？首先，我们来看一下什么是 undefined吧...

### Overview of undefined

变量的值都会有对应的类型，在 JS 中有几种内置的类型：
1. Undefined
2. Null
3. Boolean
4. String
5. Number
6. Object
7. Reference
8. etc...

看第一个，内置的 [Undefined](http://es5.github.io/#x8.1) 类型仅仅可以拥有一个值，那就是 undefined。该值为原始值，所有变量申明的时候都会赋值为 undefined ，直到程序中给变量再次赋值。

当函数执行完，如果并没有给出明确的返回值的话，函数会默认的返回 undefined。
```JavaScript
var foo,
    bar = (function() {
        // do some stuff 
    }()),
    baz = (function() {
        var hello;
        return hello;
    }());

typeof foo; // undefined
typeof bar; // undefined
typeof baz; // undefined
```
当我们申明变量但没有赋值的时候，该值就是 undefined。但我方面应该注意 undefined 也是全局作用域下的一个变量或属性，其值同样为 undefined。
```JavaScript
typeof undefined; // undefined

var foo;

foo === undefined; // true
```
然而，全局变量 undefined 并不是保留字，因此可以覆写它。幸运的是：在 ES 5中 undefined 是不允许被重新定义的，但是之前的版本或是老点的浏览器还是能发生一下的情况：
```JavaScript
typeof undefined; // undefined
undefined = 99;
typeof undefined; // number
```

### What is this null business all about?
试一下以下的代码吧。
```JavaScript
null == undefined // true
null !== undefined // true
```
许多人就会对此感到困惑，解释起来蛮简单的。在仅检验类型上，它俩都是 false。

`==`并不严格的比较，但使用`!==`则是严格相等。当你看到 null 作为值的时候，它仅仅是程序化的赋值，在默认情况下不设置。

### Accessing properties on on object

当你去使用一个对象上不存在的属性时，会返回undefined。但你使用一个并不存在的属性作为一个函数调用的话，有时候就会报错。
```JavaScript
var foo = {};

foo.bar; // undefined
foo.bar(); // TypeError
```
如果你想去区分一个属性，值为undfined和一个不存在的属性，该怎么做呢？使用`typeof`或是 `===`吗？可两者的返回值都是 undefined。

可是使用 `in` 操作符，因为该操作符会检验一个属性是否存在于对象中。就像这样：
```JavaScript
var foo = {};

// undefined (Not good, bar has never been declared in the window object)
typeof foo.bar;

// false (Use this if you don't care about the prototype chain)
'bar' in foo;

// false (use this if you do care about the prototype chain)
foo.hasOwnProperty('bar');
```
### Should you use typeof or in / hasOwnProperty?

总得来说，如果你想测试一个属性是否存在的话，你可以使用`in / hasOwnProperty`，但如果你想检验一个属性的值的时候，则使用`typeof`。

### Let’s recap(概括) with some examples

检验一个存在的变量：
```JavaScript
if (typeof foo !== 'undefined') {}
```

检验一个属性是否存在于对象中，无论它是否被赋值：
```JavaScript
// exists on the object, checks the prototype too
if ('foo' in bar) {}

// exists directly on the object, don't check the prototype
if (bar.hasOwnProperty('foo')) {}
```

检验一个属性值是否存在对象中，并且检验该属性是否被赋值：
```JavaScript
var bar = {
    foo: false
}; 

if ('foo' in bar && typeof bar.foo !== 'undefined'){ 
    // bar.foo exists, and it contains a value which was programatically assigned
}
```


















