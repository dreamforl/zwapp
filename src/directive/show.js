// 绑定z-show
export function set_z_show (name, value, el, component) {

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