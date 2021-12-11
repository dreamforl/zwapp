// 添加ref
function setRefs (el, name_space) {
  let el_list = el.querySelectorAll('[ref]')
  for (let i = 0; i < el_list.length; i++) {
    let ref = el_list[i].getAttribute('ref')
    name_space.$refs[ref] ? warn('重复ref', el_list[i], name_space.$refs[ref]) : (name_space.$refs[ref] = el_list[i])
  }
}