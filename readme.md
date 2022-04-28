# CRead

## continue your reading

## 1.这个项目是啥

CRead 用于自动追踪同一系列网站上的阅读进度

比如正在通过这个网站学习 javascript：[https://zh.javascript.info/function-expressions](https://zh.javascript.info/function-expressions)，只需在匹配规则中填 [https://zh.javascript.info/](https://zh.javascript.info/)，则下次浏览同一系列页面（若当前页面 url 包含匹配规则，则视为同一系列页面），如[https://zh.javascript.info/nullish-coalescing-operator](https://zh.javascript.info/nullish-coalescing-operator)，则会自动更新子标题、链接至当前页面

## 2.子标题匹配规则有哪些

### 1.title 规则（默认）

填写示例: title

此规则会自动抓取当前页面 title 为子标题

### 2.title 分割规则

填写示例: title[num]

当页面标题中包含 "-" "|" 符号时，会分割标题为多个部分，并取第[num]部分（以0为第一项）为子标题。

如当页面标题为“字符串的扩展 - ECMAScript 6 入门”，子标题规则为 title[0] 时，会取“字符串的扩展”为子标题

### 3.id 选择器

填写示例: #element

取页面中特定 id 元素内容为子标题

### 4.class 选择器

填写示例: .element[num]

取页面中特定 class 元素内容为子标题。num 值必须包含，其意义为第几个特定 class 元素

## 3.如何安装

[安装 chrominum edge 扩展](place){暂未发布}

## 4.其它

### 1.恳求各位帮助

本人能力有限，代码能力非常糟糕，这个扩展可能有一堆 bug，而且代码组织说实在的自己有时候都看不下去。希望有能力、有时间的大佬能多多帮助这个项目。

本人设计能力有限，界面糟糕，如果有大佬能贡献一些设计是再好不过的。

### 2.为什么没有 chrome 拓展

如上所述，本人能力有限，没能力、没时间去检查是否兼容 chrome。若要自己打包发布至 chrome 商店，请自便。
