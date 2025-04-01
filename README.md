## zwapp

包含 h、Fragment、还有基础的render函数，以及版本信息version。

使用jsx语法，只需要在tsconfig.json中配置即可

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
  }
}
```

### 基础使用

#### vite

```tsx
import { render } from "zwapp";
function App() {
  return (
    <>
      <div className="app">
        <h1 onClick={() => console.log('点击事件')}>这是zwapp</h1>
        <h1>2</h1>
      </div>
    </>
  );
}

const root = document.getElementById("app");
render(App(), root);
```



### render

```jsx
render(<h1>2</h1>, root)
```

也可以直接给予对象

```js
render(
  {
    type: "h1",
    children: ["h1标签"],
    props: { className: "item", style: { color: "red" } },
  },
  root
);
```



### 不足

1. 现在是全量更新，性能较差，后续使用 diff 比较

2. 会暴露h和Fragment到window上面

