## sessionStorage

前几天遇到突然遇到了这个问题：关于客户端存储 sessionStorage ，它能够共享多tab的情况呢？

首先对sessionStorage有一个简单的认识，那就是sessionStorage它的存储方式和当前的session（会话）有关。

而这里的session又和服务端记录用户信息的session不同。这个session是每打开一个新的站点都会有一个独立的session。而sessionStorage仅仅是浏览器提供给当前session一个客户端存储的解决方法。

我们大致明白sessionStorage是什么了之后，我们重新回到主线问题：那sessionStorage 是否在**多个tab**存在**共享情况**呢？

这个问题我们先提取关键词：多tab，共享。其实这两个关键词我们所有人的理解差不多是相同的，那我们接下来需要思考的是如何能够触发**多tab**情况。

在目前我的思考中，能够形成**多tab**的情况，大致只有以下两种情况：

1. 现有一个A tab，然后单独打开了一个B Tab
2. 现有一个A tab，然后从A 页面超链接中打开一个 B tab

找到了这两种情况后，我们便可以测试实验了。

第一种情况超级容易模拟，事先在已有的A Tab中种下sessionStorage信息，然后在重新打开的B Tab 去 sessionStorage中获取信息，发现获取不到。所以在这样的情况打开的页面是不会进行共享的。

第二种情况，我测试了两种方式超链接打开方式，大致代码如下：

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>首页</title>
</head>
<body>
    this is home page
    <a href="/b.html" target="_blank" onclick="sessionStorage.setItem('j', 's')">跳转页面</a>
    <a href="/b.html" target="_blank" rel='noopener noreferrer' onclick="sessionStorage.setItem('p', 'd')">跳转页面</a>
</body>
</html>
```

第一种普通的超链接打开方式，在打开的B Tab中是可以正常访问到 sessionStorage 的。

第二种我给超链接加上了`rel='noopener noreferrer'`属性，这个功能打开的新tab是不存在`opener`的以及在chrome的环境中，会有单独的渲染进程对新页面进行处理。因为我想排除这部分共享工作会不会和同一个渲染进程有关。因为若是超链接方式打开的统一站点，在chrome的环境下会共享同一个渲染进程。

但是测试完之后，发现同样可以做到共享。

是自己日常工作中，使用 sessionStorage 的机会比较少，所以对这细节方面的并没有很清楚的了解。当然 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) 上确实给出来明确的解释。但是没有具体说为什么（当然你可以理解成这是就是当初设计这个宿主环境API的理念吧）。大致贴下下面，超链接的方式就是文档中加粗的第二点。

- A page session lasts as long as the browser is open, and survives over page reloads and restores.
- **Opening a page in a new tab or window creates a new session with the value of the top-level browsing context, which differs from how session cookies work.**
- Opening multiple tabs/windows with the same URL creates `sessionStorage` for each tab/window.
- Closing a tab/window ends the session and clears objects in `sessionStorage`.