//需要返回dom，因为要绑定到类组件上面
export default function render(node, parent) {
  if(!node) return
  const type = typeof node;
  const mount = parent ? (el) => parent.appendChild(el) : (el) => el;
  if (type === "string" || type === "number") {
    //文本节点
    return mount(document.createTextNode(node));
  } else if (type === "object" && typeof node.type === "string") {
    // 虚拟DOM
    const dom = document.createElement(node.type);
    const props = node.props ? node.props : {};
    //class属性
    // 1 有class属性，以class属性为准
    // 2 没有class 并且有className属性，class属性值为className的值，并且移除className属性
    if (props.className && !props.class) {
      props.class = props.className;
      delete props.className;
    }
    for (let k in props) {
      setAttribute(dom, k, props[k]);
    }
    for (let child of node.children) {
      //是数组的话，就渲染数组的子元素
      //不是数组的话，就直接渲染
      child instanceof Array
        ? child.forEach((child_item) => render(child_item, dom))
        : render(child, dom);
    }
    return mount(dom);
  } else if (typeof node.type === "function") {
    //组件
    if (node.type.isClass) {
      renderClass(node, parent);
    } else {
      renderFunction(node, parent);
    }
  } else if (type === "function") {
    //直接是函数的话，就是直接render，没有写成标签的形式，没有props和children
    const newnode = {
      props: {},
      children: [],
      type: node,
    };
    if (node.isClass) {
      renderClass(newnode, parent);
    } else {
      renderFunction(newnode, parent);
    }
  } else if (node.type === Symbol.for("document-fragement")) {
    let dom = document.createDocumentFragment();
    node.children.forEach((item) => {
      render(item, dom);
    });
    return mount(dom);
  }
}

function setAttribute(dom, k, v) {
  if (typeof v === "function") {
    //jsx返回的函数 onClick
    if (k.startsWith("on")) {
      dom.addEventListener(k.replace("on", "").toLowerCase(), v);
    }
    //添加函数形式的ref
    if (k === "ref") {
      v(dom);
    }
  } else if (k === "style" && v instanceof Object) {
    // 是否是style对象
    Object.assign(dom.style, v);
  } else if (typeof v !== "object") {
    // 其余的都是属性
    dom.setAttribute(k, v);
  }
}

function renderClass(node, parent) {
  let classComponent = new node.type(node.props);
  classComponent.willComponentMount(); //组件将要渲染
  classComponent.children = {
    //允许直接渲染组件的子节点
    type: Symbol.for("document-fragement"),
    children: node.children,
  }; //组件的子节点
  classComponent._rendering = true // 正在更新
  let dom = render(classComponent.render(), parent);
  classComponent.dom = dom; //组件的DOM实例
  classComponent._rendering = false // 更新完毕
  classComponent.didComponentMounted(); //组件渲染完毕
  return dom;
  // 类组件
}

function renderFunction(node, parent) {
  render(node.type(node.props), parent);
}
