import zwapp from "zwapp";
function B(props: { name: string }) {
  return <h1>b-{props.name}</h1>;
}
export const App = () => {
  console.log("version:", zwapp.version);
  return (
    <div className="app">
      <h1>a-{zwapp.version}</h1>
      <B name="张三"></B>
    </div>
  );
};
