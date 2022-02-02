## zwapp框架

本框架主要用于学习使用,感谢微信公众号 ==神光的编程秘籍==

```js
import zwapp from 'zwapp'
```

```js
//包含
{
	version: '0.0.4',
	render,
	Component
}
```



### 类组件

基本功能已经实现。

需要继承zwapp.Component

需要有render方法，返回一个要渲染的内容 ,

```jsx
class classComponent extends Component{
  constructor(props) {
		super(props)
		this.state = {
			count: 1,
			name:'李四'
		}
	}
  render() {
		let { name } = props
		let { count } = this.state
		return (
			<div>
				<h1>{count}</h1>
				<h1 onClick={this.show}>类组件{name}</h1>
				<button onClick={this.add}>+1</button>
			</div>
		)
	}
}
```

#### 生命周期

1. willComponentMount 组件将要渲染
2. didComponentMounted 组件渲染完毕
3. componentUpdated组件更新完毕

#### props

可以传递属性给组件（任意属性都可以）

```html
<ClassComponent name='类组件'></ClassComponent>
```

则传递了props: {name:'类组件'} 给类组件

使用this.props可以获取

#### state

单个组件的状态管理，要求是对象

##### 使用状态 

```js
let {name} = this.state
```

##### 修改状态

```js
this.setState({
  name:'新名字'
})
```

#### dom

获取当前组件的DOM实例

组件渲染完毕之后，可以使用this.dom可以获取

#### 不足

现在是全量更新，性能较差，后续使用diff比较

### 函数组件

函数需要返回要渲染的内容。(未实现响应式)

```jsx
function functionComponent(props) {
	let { name } = props
	return (
		<div>这是function组件----{name}</div>
	)
}
```

```html
<Function name='函数'></Function>
```



### webpack配置jsx

#### 安装loader

1. @babel/core
2. @babel/preset-react
3. babel-loader

#### 配置loader

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
    children
  };
};
```

