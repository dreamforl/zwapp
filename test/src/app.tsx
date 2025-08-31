import zwapp from "zwapp";
function B(props: { name: string }) {
  return <h1>b-{props.name}</h1>;
}
export const App = () => {
  console.log("version:", zwapp.version);
  return (
    // <div className="app">
    // </div>
      <B name="张三"></B>
  );
};
