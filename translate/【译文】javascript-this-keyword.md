## JavaScript 中 this 关键字

`this`是 JS 中使用最为普遍的关键字，但这也是令人最为困惑和被错误解释的点。那 this 到底是什么意思并且 this 时如何决定的呢？

本文尽力去回答上述的两个问题，开始吧！

this 关键字对于那些使用过其他语言的开发人员而言并不陌生，而且它是只通过类的构造函数实例化时创建的新对象。

举个例子，如果你有一个拥有moveBoat方法的Boat类，当你在 moveBoat 方法使用 this的时候，实际上访问的就是从Boat类上新创建的对象（ the newly created object of Boat()）。

在JS中，当你使用 new 关键字执行构造函数的时候同样会有 this 这个概念，然而这并不是唯一的规则， this 也可以在不同的对象中指向不同的执行上下文。如果你不熟悉执行上下文的话，可以阅读我上次的译文。说的够多了，我们看一些例子：

```JavaScript
// global scope

foo = 'abc';
alert(foo); // abc

this.foo = 'def';
alert(foo); // def
```

无论何时，你在全局上下文（不在函数里）中使用 this 关键字，它总是指向全局对象。现在我们来看见在函数中使用 this 关键字：
```JavaScript
var boat = {
    size: 'normal',
    boatInfo: function() {
        alert(this === boat);
        alert(this.size);
    }
};

boat.boatInfo(); // true, 'normal'

var bigBoat = {
    size: 'big'
};

bigBoat.boatInfo = boat.boatInfo;
bigBoat.boatInfo(); // false, 'big'
```

上述 this 关键字时怎样决定的呢？我们可以看到Boat对象，其中有一个 boatInfo的方法，它会判断当前 this 是否为 boat 对象并且输入当前 this 的 size属性。我们使用`boat.boatInfo()`触发，我们发现此时的 this 就是 boat 对象以及 size 属性值为 normal。

我们在创建另一个bigBoat对象，它也有一个 size 属性。接下来我们给 bigBoat对象从 boat对象上拷贝 boatInfo 方法过来。接下来当我们触发bigBoat的boatInfo函数时，发现 this 值已经不是 boat 了而 size 的值为 big 了。到底发生了什么？在boatInfo 中的 this 是怎样改变的？

首先大家要了解一件事： 任何函数中的 this 值并不是静态的，当你每一次调用一个函数的时候，在执行之前才会确定 this 的值。 在函数内部中的 this 值实际取决于该函数调用的父级作用域，更重要的是函数语法是怎样写的。

当函数被调用的时候，我们应该里面看一下在「()」左边的表达式。如果括号左边看到的是一个 reference，接下来 this 的值就是调用该方法的对象，否则就是全局对象。让我们看看其他的例子：

```JavaScript
function bar() {
    alert(this);
}
bar(); // global - because the method bar() belongs to the global object when invoked

var foo = {
    baz: function() {
        alert(this);
    }
}
foo.baz(); // foo - because the method baz() belongs to the object foo when invoked
```
如果到目前为止一切都清楚，那么上面的代码就说得通咯。我们可以将同样的函数通过改变 this 的值使其复杂化，用以下两种方式调用函数：

```JavaScript
var foo = {
    baz: function() {
        alert(this);
    }
}
foo.baz(); // foo - because baz belongs to the foo object when invoked

var anotherBaz = foo.baz;
anotherBaz(); // global - because the method anotherBaz() belongs to the global object when invoked, NOT foo
```
这里我们可以看到在通过两种不同的调用方法，baz函数中的 this 值是不同的。接下来看看多层嵌套的对象中的 this 值：
```JavaScript
var anum = 0;

var foo = {
    anum: 10,
    baz: {
        anum: 20,
        bar: function() {
            console.log(this.anum);
        }
    }
}
foo.baz.bar(); // 20 - because left side of () is bar, which belongs to baz object when invoked

var hello = foo.baz.bar;
hello(); // 0 - because left side of () is hello, which belongs to global object when invoked
```

另一个问题是 this 值在事件处理函数中何时决定呢？在事件处理函数中 this 值往往只想的是被触发的元素本身。看看下面的例子：
```JavaScript
<div id="test">I am an element with id #test</div>

function doAlert() { 
    alert(this.innerHTML); 
} 

doAlert(); // undefined 

var myElem = document.getElementById('test'); 
myElem.onclick = doAlert; 

alert(myElem.onclick === doAlert); // true 
myElem.onclick(); // I am an element
```
这里我们首先触发了 doAlert 函数，这时候因为时全局对象所以输出 undefined。但之后我们给 myElem 元素点击事件绑定了 doAlert 函数，每当点击事件触发的时候 doAlert 函数就会进行处理，而这是时候的 this 值将会变为 myElem 元素。

最后我只想说一件事，this 的值可以使用 call 和 apply 手工设置，将会复写我们今天讨论的 this 值。还有之前说在函数构造器中的 this 为什么指向一个新建的对象。因为函数构造器会触发 new 关键字，算便宜构造器中的this永远只想一个新的对象。

### Summary

希望今天的文章可以帮助你理解 this 关键字以及能帮助你更好的理解 this 的值。现在我们知道了 this 的值并不是静态的而是取决于方法是如何调用的。