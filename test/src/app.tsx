import zwapp, { useState } from "zwapp";
function B(props: { name: string }) {
  return (
    <div className="b">
      <h1>b-{props.name}</h1>
      <C></C>
    </div>
  );
}
function C() {
  const [count, setCount] = useState(0);
  return (
    <div className="c">
      <h1>c-{count}</h1>
      <button onClick={() => setCount((pre) => pre + 2)}>+2</button>
    </div>
  );
}
export const App = () => {
  const [count, setCount] = useState(1);
  const [time, setTime] = useState(new Date().toLocaleString());
  return (
    <div className="app">
      <h1>好</h1>
      <div className="box">
        <div className="item">子元素</div>
        <h1>count-{count}</h1>
        <button onClick={() => setCount((pre) => pre + 1)}>+1</button>
        <h1>time-{time}</h1>
        <button onClick={() => setTime(new Date().toLocaleString())}>
          修改时间
        </button>
        <C></C>
      </div>
    </div>
  );
};
