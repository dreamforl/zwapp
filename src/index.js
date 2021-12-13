import domReady from './util/domReady'
import { fastEval, fastEvalWith } from './util/eval'
import { warn } from './util/error'
import { getType } from './util/getType'
import { initNameSpace } from './util/initNameSpace'
import { depend } from './util/observer'
import { set_z_bind, set_z_for, set_z_if, set_z_show, set_z_model, set_z_on, setRefs, set_z_text } from './directive/index'
// 设置命名空间-根据z-data来设置  支持 z-data='getdata()'  或者z-data='getdata'
function setNameSpace (namespace) {
  let el_list = document.querySelectorAll('[z-data]')
  el_list.forEach((item, index) => {
    let el_fun = item.getAttribute('z-data')
    el_fun = el_fun.replace(/\s/g, '')
    let perform_data
    // 区分是否带括号
    if (/\(.*?\)/.test(el_fun)) {
      perform_data = fastEval(el_fun, item)
    } else {
      perform_data = fastEval(el_fun + '()', item)
    }
    let component = initNameSpace(perform_data)
    component.name = `zw-component-${index}`
    // 依赖收集在根节点
    item.$depend = new depend()

    //绑定this.$el 为根节点
    component.this.$el = item
    let proxy = new Proxy(component.this, {
      set (target, key, value) {
        item.$depend.change(key, value)
        return Reflect.set(target, key, value)
      }
    })
    //设置this.$refs
    setRefs(item, component)
    component.this = proxy
    console.log(component);
    item.setAttribute(component.name, '')
    // 添加 当前命名空间到namespace
    namespace.set(component.name, proxy)
    get_child(component, item)
  })
}
// 递归选任子节点
function get_child (component, el) {
  //需要考虑当前是否是隐藏和未渲染z-show=false/z-if=false
  if (!el) { return }
  render_child(component, el)
  let length = el.children.length
  if (length > 0) {
    for (let i = 0; i < length; i++) {
      get_child(component, el.children[i])
    }
  }

}
function render_child (component, el) {

  el.setAttribute(component.name, '')

  // 设置 根据z-属性操作
  getAttr(component, el)
}
const attr_reg = /^z-(on|bind|show|if|model|text|for)/
// 遍历获取所有z-的属性
function getAttr (component, el) {
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
      handler_attr(name, value, el, component)
    }
  }
}
// 根据不同的z-来执行不同的指令
function handler_attr (name, value, el, component) {
  if (/z-on/.test(name)) {
    return set_z_on(name, value, el, component)
  }
  if (/z-bind/.test(name)) {
    return set_z_bind(name, value, el, component)
  }
  name = name.match(attr_reg)[1]
  switch (name) {
    case 'show': {
      return set_z_show(name, value, el, component)
    }
    case 'if': {
      return set_z_if(name, value, el, component)
    }
    case 'model': {
      return set_z_model(name, value, el, component)
    }
    case 'text': {
      return set_z_text(name, value, el, component)
    }
    case 'for': {
      return set_z_for(name, value, el, component)
    }
  }
}

const zwapp = {
  version: '1.0.0',
  async init () {
    await domReady()
    // 初始化命名空间容器
    this.namespace = new Map()
    setNameSpace(this.namespace)
  }
}
zwapp.init()
export default zwapp