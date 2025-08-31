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
  return <div className="c">c</div>;
}
export const App = () => {
  // const [count, setCount] = useState(0);
  return (
    <div className="app">
      <h1>好</h1>
      <div className="box">
        <div className="item">子元素</div>
      </div>
    </div>
  );
};
