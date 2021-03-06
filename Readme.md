### zwapp框架

本框架主要用于学习使用

本人是vue的爱好者，之前看到了[alpinejs](https://www.alpinejs.cn/)这个库，感觉写的很好，自己也想写一个类似的，这样各种知识也可以融会贯通了

由于依赖于ES6的Proxy，所以不兼容IE11及以下（当然用于学习，一般都用谷歌啦）



### 示例

getdata函数示例（要挂载在window上）,内部配置与vue使用方式一样

```javascript
//getdata示例，慢慢会实现与vue的options一致
function getdata() {
  return {
    data() { return {} }, //完成
    methods: {},  //方法放到这里
    created() { }, //在数据获取之后执行
    computed: {}, //未完成
    watch: {}//未完成
  }
}
```

### 指令

#### z-data 作用域

```html
<div z-data='getdata()'></div>
```

目前是以一个z-data为一个作用域，这个作用域中的值是通过getdata()这个函数返回的对象。（可以不带括号）

已经实现

#### z-if 元素渲染与否

```html
<h1 z-if='show'></h1>
```

存在问题-当移除元素之后，不知道应该如何添加

#### z-show 元素显示或隐藏

```html
<h1 z-show='show'></h1>
```

根据show,来简单的切换display:none的存在与否

已经实现

####  z-bind 属性绑定

```html
<!-- 使用方式一  z-bind:name='show' -->
<h1 z-bind:name='show'></h1>   
<!-- 使用方式二 	:name='show' -->
<h1 :name='show'></h1>
```

已经实现

#### z-on 事件绑定

```html
<!-- 使用方式一  z-on:click='change' -->
<h1  z-on:click='change'></h1>   
<!-- 使用方式二 	:name='change' -->
<h1  @click='change'></h1>
```

绑定的函数，可以通过显式传递$event来获取事件对象，可以传递参数，如果未传递参数的话，默认传递事件对象

已经实现

#### z-text 元素的值

```html
<h1 z-text='text'></h1>
```

设置了z-text的元素，他的innerHTML会被设置为作用域内绑定的值

已经实现

#### z-model 双向数据绑定

```html
<input type="text" z-model='name'>
```

已经实现

#### z-for 列表渲染

```html
<h1 z-for='item in list'></h1>
```

未实现

#### ref 存储DOM节点

```html
<h1 ref='h1'></h1>
```

```javascript
this.$refs.h1  //获取当前组件内绑定的dom
```

已经实现

