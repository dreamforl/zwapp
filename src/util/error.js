
// 错误的打印
export function warn (msg, expression, ...args) {
  let str = `zwapp expression Error: ${msg}${expression ? '\n\nexpression:' + expression : ''}`
  let el_list = []
  args.forEach(item => {
    if (item instanceof HTMLElement) {
      el_list.push('\n\nError-Element')
      el_list.push(item)
    } else {
      str += '\n\n' + item
    }
  })
  console.warn(str, ...el_list);
  throw new Error(str)
} 