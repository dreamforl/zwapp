### zwapp框架

本框架主要用于学习使用

本人是vue的爱好者，之前看到了[alpinejs](https://www.alpinejs.cn/)这个库，感觉写的很好，自己也想写一个类似的，这样各种知识也可以融会贯通了

由于依赖于ES6的Proxy，所以不兼容IE11及以下（当然用于学习，一般都用谷歌啦）

### 使用示例

```html
<div z-data='getdata()'>
  <h1 z-text='text'></h1>
  <button z-click='add'>加1</button>
</div>
```

```javascript
function getdata() {
  return {
    text: 1,
    add() {
      // debugger
      this.text += 1
      console.log(this)
    }
  }
}
```

### 解释示例

1. 在上述示例中，使用z-data来绑定当前组件的作用域（在zwapp中，一个z-data就是一个组件）getdata()返回的对象就是当前组件的作用域。

2. 

   ```html
   <h1 z-text='text'></h1>
   ```

   这里绑定了z-text 意思就是，将当前作用域内的text的值，渲染为h1标签的innerText

3. 

   ```html
   <button z-click='add'>加1</button>
   ```

   z-click 给button添加点击事件，事件函数也是在当前作用域内的

### 缺陷

1. z-data必须是一个函数而且要写成z-data='getdata()'的形式，不能省略后面的括号，后续处理一下

2. 事件处理z-click后面不能带括号，而且不能传递参数，后续会修改为可以传递参数和事件对象
3. 目前只有z-data z-text z-click三种，后续会按照vue的使用方式添加

