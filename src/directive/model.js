
// 已实现
// 双向 绑定z-model，只支持input  且type=text|textarea
function set_z_model (name, value, el, name_space) {
  if (!(el instanceof HTMLInputElement)) {
    warn('z-model需要绑定在input元素上', el)
  } else {
    //设置input的初始化值
    el.value = name_space[value]
    let depend = name_space.$el.$depend
    //根据namespace中的值变化
    depend.add(value, (value) => {
      el.value = value
    })
    // 根据input的值，修改namespace中的值
    el.addEventListener('input', (e) => {
      name_space[value] = e.target.value
    })
  }
}