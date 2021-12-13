// 绑定z-text
export function set_z_text (name, value, el, component) {
  let depend = component.this.$el.$depend
  el.innerText = component.this[value]
  depend.add(value, (value) => {
    el.innerText = value
  })
}