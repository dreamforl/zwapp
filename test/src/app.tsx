import { useState } from "zwapp";
function C(props: { click: () => void }) {
  const [count, setCount] = useState(0);
  return (
    <div className="c">
      <h1>c-{count}</h1>
      <button onClick={() => setCount((pre) => pre + 2)}>+2</button>
      <h1 onClick={props.click}>父组件+1</h1>
    </div>
  );
}
export const App = () => {
  const [list, setList] = useState<string[]>(["1"]);
  console.log("list:", list);
  console.log("渲染子");
  return (
    <div className="TEMP" key="1">
      <h1>好</h1>
      <div className="box">
        <button
          className="item"
          onClick={() => setList((prev) => [...prev, `${prev.length + 1}`])}
        >
          子元素
        </button>
        {list.map((item, index) => {
          return (
            <div className="item" key={index}>
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};
