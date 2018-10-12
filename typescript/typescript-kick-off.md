## typescript

### 为什么使用 TS ?

- 一直做后台管理系统，前后端对完接口后，突然返回并不是预期的格式，TS本身语法可以帮忙做一些判断，就可以除去无必要的代码
- 后台业务逻辑过于复杂时，对一些变量具体类型和结果不熟悉导致使用出错，TS静态类型可以帮忙。
- 重构！！动态类型一时爽，重构起来火葬场！古人诚不欺我。

以上是我为什么要学习TS，但是学至现在都觉得还只是入门级别，很多高级特性其实在实践中用到极少（实践的也并不多）。

### 语法备忘录

其实基本类型就是 JS 中基本的类型（string、boolean、number、object、null、undefined、symbol），此外扩充了 array、void、never、enum、tuples。

#### 解释部分概念

> Focus on concepts, not syntax

|      名词      |                       解释                       |
| :------------: | :----------------------------------------------: |
|   enum 枚举    |    语义化的定义一些特定值（支持数字或字符串）    |
|  tuples 元组   |         事先定义好(长度、对应类型)的数组         |
| interface 接口 |        描述一个对象必须有什么属性或方法。        |
|  generic 泛型  | 事先定义好的广泛类型，调用的时候才能知道对应类型 |

#### Interface

```typescript
// 对象接口
interface Person {
    name: string;
    // 可选使用 ?
    age?: number;
    // [propName: string]:any 可动态设置类型
    [propName: string]:any;
}
// 函数接口
interface SayFun {
    (message: string):void;
}
```

#### Class

主要记住修饰符的作用。

private 真的很自私只能在自身访问。

protected 相对自私，可以给同辈的自家人用（自身与自身的派生类（子类）都可以访问）。

#### Generic

一开始并不能明白泛型的概念，后面看了一些别人的代码，感觉就是一个「广泛的类型」嘛，看翻译觉得汉字博大精深呀。

当然了很多的学过面向对象的开发者并不这么觉得，然后有什么关系呢。来用代码教懂你是什么是泛型。

```typescript
const person = {
    name: 'baiji',
    age: 21,
}
// type 自定义类型
// typeof 可以生成对应的接口
type Person = typeof person;
// keyof 获取对象的 key，生成 key的联合类型
type PersonKeys = keyof Person;
// 获取到了 value 的联合类型
type PersonValues = Person[PersonKeys];
function getProperty(obj:Person, key:PersonKeys):PersonValues {
    return obj[key];
}
// 是不是觉得写一个函数很麻烦，要有这么多的前置条件
// 然后直接在函数前定义两个类型(调用的时候，才知道类型)
// 但是函数规则依旧是上述的逻辑，这样就不用写上述那么多的前置条件咯~
function<T, K extends keyof T>(obj: T, key: k):T[k] {
    return obj[key];
}
// 这只是一个方式让你去了解泛型，更多请到官方
// 中文：https://www.tslang.cn/docs/handbook/generics.html  英文：https://www.typescriptlang.org/docs/handbook/generics.html
```

而且 TS 内部有许多内置的类型（具有工具属性），一些比较高级的类型，可以查看一下文档噢

> https://github.com/Microsoft/TypeScript/blob/master/lib/lib.es5.d.ts#L1354

`待补充`

------

### 配置文件

![](https://github.com/baixiaoji/blog/blob/master/images/typescript-config.png)

### 类型文件（*.d.ts）

使用第三方包的最强大的就是这个文件，可以在这个文件看到暴露的api，以及可以看到对应的函数参数类型。

#### what is declare file?

*.d.ts文件该第三方插件模块的类型信息的汇总

#### why use it？

如果没有对应依赖包的申明文件，TS编译器是不能解析三方模块有哪些类型结构，从而编译会报错。

#### how to use？

```bash
npm install @types/<modules_name> -D
```

