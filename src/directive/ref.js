// 添加ref
export function setRefs (el, component) {
  let el_list = el.querySelectorAll('[ref]')
  for (let i = 0; i < el_list.length; i++) {
    let ref = el_list[i].getAttribute('ref')
    if (component.this.$refs[ref]) {
      warn('重复ref' + el_list[i], component.this.$refs[ref])
    } else {
      component.this.$refs[ref] = el_list[i]
    }
  }
}