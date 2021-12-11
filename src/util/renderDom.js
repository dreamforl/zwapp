// 获取当前作用域的抽象语法树
// {
//   attr:[],
//   child:[],
//   label:[],
//   directive:[]
// }
//最后一层
// {
//   text:''
// }
function getDOMTree (el) {
  let attr = el.attributes
  let el_list = []
  let { childNodes } = el;
  childNodes.forEach(child => {
    if (child.nodeType === 1) {
      el_list.push(getDOMTree(child));
    } else if (child.nodeType === 3) {
      el_list.push({
        text: child.nodeValue
      });
    }
  })
  return {
    type: el.tagName.toLowerCase(),
    attr, child: el_list
  }
}
// 渲染语法树
function render (tree, el = null) {
  let { attr, child, type, directive, text } = tree
  if (!el && text) {
    el = document.createDocumentFragment()
    el.textContent  = text
    return el
  } else if (el) {
    if (text) {
      el.innerHTML += text
      return el
    } else {
      let dom = document.createElement(type)
      for (let child_attr of attr) {
        let clone_attr = child_attr.cloneNode();
        dom.setAttributeNode(clone_attr)
      }
      child.forEach(item => {
        render(item, dom)
      })
      el.appendChild(dom)
      return el
    }
  }

}