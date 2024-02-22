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

[安装 chrominum edge 扩展](https://microsoftedge.microsoft.com/addons/detail/cread/kebcoljlaffafhkamgclghfkmkhglbcb)
