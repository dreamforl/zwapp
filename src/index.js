import domReady from './util/domReady'
// 设置命名空间-根据z-data来设置  支持 z-data='getdata()'  或者z-data='getdata'
function setNameSpace (namespace) {
  let el_list = document.querySelectorAll('[z-data]')
  el_list.forEach((item, index) => {
    let el_fun = item.getAttribute('z-data')
    el_fun = el_fun.replace(/\s/g, '')
    let item_space
    // 区分是否带括号
    if (/\(.*?\)/.test(el_fun)) {
      item_space = fastEval(el_fun, item)
    } else {
      item_space = fastEval(el_fun + '()', item)
    }
    item.$depend = new depend()
    item_space.$refs = {}
    let item_space_proxy = new Proxy(item_space, {
      set (target, key, value) {
        item.$depend.change(key, value)
        return Reflect.set(target, key, value)
      }
    })
    item_space_proxy._name ? item_space_proxy._name : (item_space_proxy._name = 'zw-namespace' + index)
    item_space_proxy.$el = item
    item.setAttribute(item_space_proxy._name, '')
    // 添加 当前命名空间到namespace
    namespace.set(item_space_proxy._name, item_space_proxy)
    get_child(item_space_proxy, item)
  })
}
// 递归选任子节点
function get_child (name_space, el) {
  //需要考虑当前是否是隐藏和未渲染z-show=false/z-if=false
  if (!el) { return }
  render_child(name_space, el)
  let length = el.children.length
  if (length > 0) {
    for (let i = 0; i < length; i++) {
      get_child(name_space, el.children[i])
    }
  }

}
function render_child (name_space, el) {

  el.setAttribute(name_space._name, '')

  //设置this.$refs
  setRefs(el, name_space)
  // 设置 根据z-属性操作
  getAttr(name_space, el)
}
const attr_reg = /^z-(on|bind|show|if|model|text|for)/
// 遍历获取所有z-的属性
function getAttr (name_space, el) {
  for (let i = 0; i < el.attributes.length; i++) {
    let { name, value } = el.attributes[i]
    //去除多余空白符
    name = name.replace(/\s{2,}/g, ' ')
    value = value.replace(/\s{2,}/g, ' ')
    //替换掉 @ 为z-on  :为z-bind
    if (name[0] === '@') {
      name = name.replace(/^@/, 'z-on')
    }
    if (name[0] === ':') {
      name = name.replace(':', 'z-bind')
    }
    // 替换掉z-on:为z-on
    if (/^z-on:/.test(name)) {
      name = name.replace('z-on:', 'z-on')
    }
    if (/^z-bind:/.test(name)) {
      name = name.replace('z-bind:', 'z-bind')
    }
    if (attr_reg.test(name)) {
      handler_attr(name, value, el, name_space)
    }
  }
}
// 根据不同的z-来执行不同的指令
function handler_attr (name, value, el, name_space) {
  if (/z-on/.test(name)) {
    return set_z_on(name, value, el, name_space)
  }
  if (/z-bind/.test(name)) {
    return set_z_bind(name, value, el, name_space)
  }
  name = name.match(attr_reg)[1]
  switch (name) {
    case 'show': {
      return set_z_show(name, value, el, name_space)
    }
    case 'if': {
      return set_z_if(name, value, el, name_space)
    }
    case 'model': {
      return set_z_model(name, value, el, name_space)
    }
    case 'text': {
      return set_z_text(name, value, el, name_space)
    }
    case 'for': {
      return set_z_for(name, value, el, name_space)
    }
  }
}
// 初始化命名空间容器
window.onload = function () {
  let namespace = new Map()
  setNameSpace(namespace)
}
export const zwapp = {
  version: '1.0.0',
  async init () {
    await domReady()
  }
}