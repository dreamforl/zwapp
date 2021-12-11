// 绑定z-text
function set_z_text (name, value, el, name_space) {
  let text = fastEvalWith(value, name_space, {}, el)
  el.innerHTML = text
  // let depend = name_space.$el.$depend
  // el.innerText = name_space[value]
  // depend.add(value, (value) => {
  //   el.innerText = value
  // })

}