export declare namespace zwapp {
  type version = string;
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
}
