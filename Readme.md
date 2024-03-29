## zwapp 框架

本框架主要用于学习使用,感谢微信公众号 ==神光的编程秘籍==

```js
import zwapp from "zwapp";
```

```js
//包含
{
  version: "0.0.12", render, Component;
}
```

### render

```js
render(<div>这是render</div>, document.getElementById("app"));
```

也可以直接给予对象

```js
{
  type:'h1',
  children:['h1标签'],
  props:{className:'item',style: "color:red;background:green"}
  //其中style也可以给一个对象{ color: 'red', background: 'green' } (jsx给的是字符串)
}
```

会被渲染为

```html
<h1 class="item" style="color:red;background:green">h1标签</h1>
```

#### 事件绑定

```jsx
<button onClick={this.add}>按钮</button>
```

#### 条件渲染

```jsx
isFirst && <h1>是</h1>;

isFirst ? <h1>是</h1> : <h1>否</h1>;
```

#### 列表循环

```jsx
list.map((item) => {
  return <h1>{item}</h1>;
});
```

#### 属性绑定

```jsx
<h1 className='item'></h1>

let id = 'h1'
<h1 id={id}></h1>
```

### 类组件

基本功能已经实现。

需要继承 zwapp.Component

需要有 render 方法，返回一个要渲染的内容 ,

```jsx
import { Component } from "zwapp";
class classComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
      name: "李四",
    };
  }
  render() {
    let { name } = props;
    let { count } = this.state;
    return (
      <div>
        <h1>{count}</h1>
        <h1 onClick={this.show}>类组件{name}</h1>
        <button onClick={this.add}>+1</button>
      </div>
    );
  }
}
```

#### 生命周期

1. willComponentMount 组件将要渲染

2. didComponentMounted 组件渲染完毕

3. shouldComponentUpdate(nextState):void boolean 是否组件更新（默认是更新，返回false就是不更新，其余都是更新）

   ```js
   shouldComponentUpdate(nextState) {
       if (nextState.count > 5) {
         return false
       }
   }
   ```

   

4. componentWillUpdate(nextState):组件即将更新

5. componentUpdated 组件更新完毕

#### props

可以传递属性给组件（任意属性都可以）

```html
<ClassComponent name="类组件"></ClassComponent>
```

则传递了 props: {name:'类组件'} 给类组件

使用 this.props 可以获取

#### state

单个组件的状态管理，要求是对象

##### 使用状态

```js
let { name } = this.state;
```

##### 修改状态

```js
this.setState(
  {
    name: "新名字",
  },
  () => {
    console.log("状态修改完成"); //可以有回调
  }
);
```

#### dom

获取当前组件的 DOM 实例

组件渲染完毕之后，可以使用 this.dom 可以获取

#### children

可以获取当前节点的子节点的 jsx，用以渲染

```html
<Home name="1">
  <h1>测试</h1>
</Home>
```

则子节点为 h1 的 jsx

```js
{
  type:Symbol.for('document-fragement'),
  children:[
    {
      type:'h1',
      children:['测试'],
      props:{}
    }
  ]
}
```

可以直接在 render()中返回，并且渲染

#### ref

不支持字符串形式的 ref，支持函数形式的

```jsx
<input type='text' ref={dom=>{this.ref.input = dom}}>
```

只要继承自 Component 的组件，ref 都是对象

#### 不足

现在是全量更新，性能较差，后续使用 diff 比较

### 函数组件

函数需要返回要渲染的内容。(未实现响应式)

```jsx
function functionComponent(props) {
  let { name } = props;
  return <div>这是function组件----{name}</div>;
}
```

```html
<Function name="函数"></Function>
```

### webpack 配置 jsx

#### 安装 loader

1. @babel/core
2. @babel/preset-react
3. babel-loader

#### 配置 loader

```webpack.config.js
{
	test: /\.js(|x)$/i,
	use: {
		loader: 'babel-loader',
		options: {
			presets: [
				['@babel/preset-react',
					{
						pragma: 'createElement'
					}
				]
			],
		}
	},
	exclude: '/node_modules'
}
```

#### 添加全局性的方法 createElement

```js
const createElement = (type, props, ...children) => {
  if (props === null) props = {};
  return {
    type,
    props,
    children,
  };
};
```
