// 绑定z-if  ,有问题,如果由true变成fasle的话，没法显示
import { getDOMTree, render } from '../util/renderDom'
export function set_z_if (name, value, el, component) {
  let depend = component.this.$el.$depend
  let show = component.this[value]
  depend.add(value, (show) => {
    if (!show) {
      el.style.display = 'none'
    } else {
      el.style.removeProperty('display')
    }
  })
  if (!show) {
    el.style.display = 'none'
  } else {
    el.style.removeProperty('display')
  }

}