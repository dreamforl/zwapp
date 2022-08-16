module.exports = {
  printWidth: 100, // 一行代码的长度
  tabWidth: 2, // tab的长度
  useTabs: false, // 三元表达式是否使用tab缩进（默认空格）
  semi: false, // 结尾是否添加分号
  singleQuote: true, // 字符串使用单引号
  quoteProps: 'as-needed', // 对象中的key值是否添加引号，as-needed只有在需求要的情况下加引号，consistent是有一个需要引号就统一加，preserve是保留用户输入的引号
  jsxSingleQuote: false, // 在jsx文件中的引号是否是单引号
  trailingComma: 'es5', // 尾部逗号设置 es5是尾部逗号兼容es5，none就是没有尾部逗号，all是指所有可能的情况，需要node8和es2017以上的环境
  bracketSpacing: true, // 对象扩展中属性与括号是否有空格
  jsxBracketSameLine: false, // jsx标签多行属性写法时，尖括号是否另起一行
  arrowParens: 'avoid', // 箭头函数单参数是否要空格 always总是带括号，avoid省略

  rangeStart: 0, // range是format执行的范围，可以选执行一个文件的一部分，默认的设置是整个文件
  rangeEnd: Infinity, // rangeStart ~ rangeEnd 文件开始到结束
  vueIndentScriptAndStyle: false, // vue script和style标签中是否缩进,开启可能会破坏编辑器的代码折叠
  // 19.    endOfLine: "<lf|crlf|cr|auto>" 行尾换行符,默认是lf,
  endOfLine: 'lf', // "<lf|crlf|cr|auto>" 行尾换行符,默认是lf
  embeddedLanguageFormatting: 'off' // 默认是auto,控制被引号包裹的代码是否进行格式化
}
