export declare namespace zwapp {
  type Version = string;
  interface render {}
  interface Component {
    setState: Function;
    willComponentMount: Function;
    didComponentMounted: Function;
    componentUpdated: Function;
    readonly isClass: Function;
    ref: Object;
    props: Object;
    state: Object;
  }
  let version: Version;
  function render(): Object;
  class Component {}
}
