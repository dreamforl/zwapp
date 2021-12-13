
// 已实现
// 双向 绑定z-model，只支持input  且type=text|textarea
export function set_z_model (name, value, el, component) {
  if (!(el instanceof HTMLInputElement)) {
    warn('z-model需要绑定在input元素上', el)
  } else {
    //设置input的初始化值
    el.value = component.this[value]
    let depend = component.this.$el.$depend
    //根据namespace中的值变化
    depend.add(value, (value) => {
      el.value = value
    })
    // 根据input的值，修改namespace中的值
    el.addEventListener('input', (e) => {
      component.this[value] = e.target.value
    })
  }
}