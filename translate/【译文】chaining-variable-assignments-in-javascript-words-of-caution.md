## Chaining Variable Assignments in JavaScript: Words of Caution

单行申明多个变量是一个普遍的练习，同样是一个便捷的语法。

然而，最近回顾最近一些开发者的工作时，我发现许多人并没有意识到与其同时创建许多全局变量。


```JavaScript
(function() {
    var foo = bar = baz = 'local';
    console.log(foo); // local
    console.log(bar); // local
    console.log(baz); // local
}());
```
你能发现这些问题吗？可以试这运行下面的代码：

```JavaScript
var bar = 'funky';
var baz = 'disco';

(function helloworld() {
    var foo = bar = baz = 'local';
    console.log(foo); // local
    console.log(bar); // local
    console.log(baz); // local
}());

console.log(bar);// local, I thought it would be funky
console.log(baz);// local, I thought it would be disco
```
单行申明多个变量导致全局命名空间的泄露。许多开发者将会感到惊讶，为什么局部变量 bar 和 baz 会影响到全局下的同名变量呢？

### Why does this happen?

这是操作符的原因，换句话说同样优先级下操作符是怎样工作的？解释器执行 = 操作符时从右到左解释的。

看看这一行：
```JavaScript
var foo = bar = baz = 'local';
```
当然可以这样理解：

```JavaScript
var foo = ( bar = ( baz = 'local' ) );
```
首先执行的是`baz = 'local'`，而 baz 变量不是在局部申明的所以通过作用域链查找，结果在全局中找到了该变量。

该表达式的结果返回值为 local ，将会继续放会给下一个操作符 `bar = 'local'`。同样的变量 bar 也不是本地申明的，同样通过作用域链查找，找到后给对应的变量赋值，然后接着返回 local。

最后执行`var foo = 'local'`，因为有 var 关键字所以会在局部创建一个 foo 的变量接着给他赋值为 local。

### The Solution

避免全局泄露，我们可以将申明和复制分开：
```JavaScript
var bar = 'funky';
var baz = 'disco';

(function helloworld() {

    // method 1
    var foo, bar, baz;
    foo = bar = baz = 'local';

    // or method 2
    var foo = 'local';
    var bar = 'local';
    var baz = 'local';

    // or method 3
    var foo = 'local',
        bar = 'local',
        baz = 'local';

    console.log(foo); // local
    console.log(bar); // local
    console.log(baz); // local

}());

console.log(bar); // funky
console.log(baz); // disco
```
现在就可以了，局部变量就只会存在与他自己的作用域下了，同时保护了全局的命名空间。

### Summary

我也觉得这样写代码确实有点丑陋，但是如果这样可以阻止全局变量的影响我还是能接受的。
希望在这篇文章之后，我以后不会遇到很多全局命名空间泄漏！
