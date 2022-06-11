import { fastEvalWith } from '../util/eval'
// 绑定z-bind 可以简写为: 
const attr_reg = /^z-(on|bind|show|if|model|text|for)/
export function set_z_bind (name, value, el, component) {
  name = name.replace(attr_reg, '')
  let bind = component.this[value]
  let depend = component.this.$el.$depend
  depend.add(value, (show) => {
    el.setAttribute(value, bind)
  })
  el.setAttribute(value, bind)

}