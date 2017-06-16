# Property flags and descriptors  对象、类、继承

这一部分我们回归到对象上，深度学习对象。

【这里有目录】

## 属性标志和描述符

众所周知，对象可以存储很多属性。

到目前为止，我们了解到一个属性是以「key-value」的形式。可实际上对象属性是更加复杂和可调的（tunable）东西。

## [Property flags](http://javascript.info/property-descriptors#property-flags)（属性标志）

对象的属性中除了一个`value`之外，有三个特殊的属性（所以叫做「标志（flags）」）：

- **`writable`**（可写性）- 其值为`true`时，可以改变（或改写），否则该属性是只读状态。
- **`enumerable `**（可枚举性）- 其值为`true`时，可以在循环中展示出来，否则不能展示。
- **`configurable`**（可配置性）- 其值为`true`时，该属性可以被删除、这些属性（代指这三个属性）可以被修改，否则不能。

但是我们以前从未见过他们，因为绝大多数的情况下他们是不出现的。当我们想用一种不同寻常的方式创建一个属性的时候，将这三个属性的值都设置为`true`。但是我们还是能随时改变这三个属性。

首先，我们来看看怎样拿到这些标志。

使用[Object.getOwnPropertyDescriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)方法可以查询一个属性的所有信息。

语法如下：

```javascript
let descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
```

**`obj`**

想要拿到信息的对象。

**`propertyName`**

属性的名称

返回值被叫作「属性描述符」对象；其包含这值的所有标志（flags）。

举个例子：

```javascript
let user = {
  name: "John"
};

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');

alert( JSON.stringify(descriptor, null, 2 ) );
/* property descriptor:
{
  "value": "John",
  "writable": true,
  "enumerable": true,
  "configurable": true
}
*/
```

我们可以使用[Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)方法改变这些标志（flags）。

语法如下：

```javascript
Object.defineProperty(obj, propertyName, descriptor)
```

**`obj`** , **`propertyName`**

想要修改的对象和属性名称

**`descriptor`**

 要应用的属性的描述符

如果一个属性存在，``defineProperty` `更新他的标志（flags）。否则，该方法会创建一个设置其值和其他标志（flags）的属性；在这种情况下，如果有些标志（flags）没有提供，那么这些标志的值假定为`false`。

举个例子，这里我们创建一个`name`属性，其属性的所有的标志（flags）为假值（false）：

```javascript
let user = {};

Object.defineProperty(user, "name", {
  value: "John"
});

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');

alert( JSON.stringify(descriptor, null, 2 ) );
/*
{
  "value": "John",
  "writable": false,
  "enumerable": false,
  "configurable": false
}
 */
```

比较一下上面的创建方式和我们平常创建方式：是不是所有的标志（flags）都为false（假值）。如果这不是我们相要的，那么我们最好将他们`descriptor`(描述符)中设置为`true`。

接下来我们通过例子，看看这些flags的效果。

## [Read-only](http://javascript.info/property-descriptors#read-only)（只读）

我们通过改变`user.name`的`writable`标志使得`user.name`为只读状态：

```javascript
let user = {
  name: "John"
};

Object.defineProperty(user, "name", {
  writable: false
});

user.name = "Pete"; // Error: Cannot assign to read only property 'name'...
```

现在没有人能改写`user`对象的`name`属性，除非使用`defineProperty`覆盖我们写的。

这里是同样的操作，不同的是现在这个属性不存在：

```javascript
let user = { };

Object.defineProperty(user, "name", {
  value: "Pete",
  // for new properties need to explicitly list what's true
  // 对一个新的属性我们需要明确的展示出来
  enumerable: true,
  configurable: true
});

alert(user.name); // Pete
user.name = "Alice"; // Error
```

## [Non-enumerable](http://javascript.info/property-descriptors#non-enumerable)（不可枚举）

现在我们给`user`对象添加一个`toString`方法。

一般而言，对象内置的`toString`是不可枚举的，就是不能在`for...in` 循环中出现。可如果我们手动的添加一个`toString`方法，那么默认情况下会在`for...in`循环中出现，就像这样：

```javascript
let user = {
  name: "John",
  toString() {
    return this.name;
  }
};

// By default, both our properties are listed:
for(let key in user) alert(key); // name, toString
```

如果我们不喜欢这样，那么我们可以给该属性设置为`enumerable:false`。之后就不用担心会在`for...in`循环中出现了，就像将其内置了一样：

````javascript
let user = {
  name: "John",
  toString() {
    return this.name;
  }
};

Object.defineProperty(user, "toString", {
  enumerable: false
});

// Now our toString disappears:
for(let key in user) alert(key); // name
````

我们可以使用`Object.keys`方法过滤掉不可枚举的属性：

````javascript
alert(Object.keys(user)); // name
````

## [Non-configurable](http://javascript.info/property-descriptors#non-configurable)(不可配置)

不可枚举标志（`configurable:false`）有时候是预先内置在对象和属性上的。

一个不可配置的属性不能被删除和不能使用`defineProperty`方法改变。

举个例子，`Math.PI`是一个只读、不可枚举和不可配置属性：

````javascript
let descriptor = Object.getOwnPropertyDescriptor(Math, 'PI');

alert( JSON.stringify(descriptor, null, 2 ) );
/*
{
  "value": 3.141592653589793,
  "writable": false,
  "enumerable": false,
  "configurable": false
}
*/
````

所以，一个编程人员不能改变`Math.PI`的值和重写。

```
Math.PI = 3; // Error

// delete Math.PI won't work either
```

一旦把一个属性为不可配置，那么我们是不能将其改回来的，因为`defineProperty`不能作用在一个不可配置的属性上，所以让一个属性不可配置是单向的。

这里我们将`user.name`设置为一个永远密封的常量：

````javascript
let user = { };

Object.defineProperty(user, "name", {
  value: "John",
  writable: false,
  configurable: false
});

// won't be able to change user.name or its flags
// all this won't work:
//   user.name = "Pete"
//   delete user.name
//   defineProperty(user, "name", ...)
Object.defineProperty(user, "name", {writable: true}); // Error
````

> 错误只会在严格模式（ in use strict）出现
>
> 不在严格模式下，当修改一个只读的属性是不会报错的。但是操作是不会成功的。违反标志的行为在非严格模式下是被忽略的。

## [Object.defineProperties](http://javascript.info/property-descriptors#object-defineproperties)

使用[ [Object.defineProperties(obj, descriptors) ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)方法容许在创建对象时候一次性定义许多属性。

语法如下：

```javascript
Object.defineProperties(obj, {
  prop1: descriptor1,
  prop2: descriptor2
  // ...
});
```

在举个例子：

````javascript
Object.defineProperties(user, {
  name: { value: "John", writable: false },
  surname: { value: "Smith", writable: false },
  // ...
});
````

所以，我们可以一次性设置许多属性。

## [Object.getOwnPropertyDescriptors](http://javascript.info/property-descriptors#object-getownpropertydescriptors)

一次性获取到有关属性所有的描述符，我们可以使用[Object.getOwnPropertyDescriptors(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors)。

结合使用`Object.defineProperties`，这种方式曾用作以「标志意识（flags-aware）」的方式克隆一个对象：

```javascript
let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
```

通常在我们克隆一个对象的时候，我们用一个赋值去赋值属性，就像下面：

````javascript
for(let key in user) {
  clone[key] = user[key]
}
````

但是这样并没有赋值标志（flags）.所以你想深度拷贝一个对象优选使用 `Object.defineProperties`。

## [Sealing an object globally](http://javascript.info/property-descriptors#sealing-an-object-globally)（全局密封对象）

属性描述只在单个属性级别上起作用。

这里还有一些方法限制对整个对象的访问。

**[Object.preventExtensions(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)**

禁止给对象添加属性

**[Object.seal(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)**

禁止添加/删除属性，就是给所有的属性设置了`configurable:false`。

**[Object.freeze(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)**

禁止添加/删除/改变属性，就是给所有的属性设置了`configurable:false,writable:false`。

这里也有一些测试他们的方法：

**[Object.isExtensible(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)**

如果添加一个属性是禁止的，返回`false`，否则返回`true`。

**[Object.isSealed(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed)**

如果禁止添加/删除属性，或是所有的属性设置了`configurable:false`，返回`true`。

**[Object.isFrozen(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen)**

如果禁止添加/删除/改变属性，或当前所有的属性设置了`configurable:false,writable:false`，返回`true`。

其实这些方法的实践中几乎用不到（翻译到最后这不是逗我吗！！）。