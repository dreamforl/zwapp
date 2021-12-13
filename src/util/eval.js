import { warn } from './error'
// 比较快速的eval方法
export function fastEval (expression, el) {
  try {
    let result = new Function(`return ${expression}`)(expression)
    return result
  } catch (e) {
    warn(e.message, expression, el)
  }
}
//传入上下文 执行eval, 可以传入表达式
export function fastEvalWith (expression, namespace = {}, params = {}, el) {
  try {
    let result = new Function(['namespace', ...Object.keys(params)], `let result;with(namespace){result = ${expression}  } return result `)(namespace, ...Object.values(params))
    return result
  } catch (e) {
    warn(e.message, expression, el)
  }
}