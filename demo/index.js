const ab = `asdlkfjasldfj`;
const cd = 'cs"`';
/**
 * 在 Vim 中，cs" 是一个由 vim-surround 插件提供的命令，用于改变包围某个文本的字符。

cs" 的含义是：

c：change，表示要改变某个东西。
s：surround，表示要改变的是包围文本的字符。
"：表示当前包围文本的字符是双引号。
所以，cs" 表示要改变包围文本的双引号。在执行这个命令后，你需要输入一个新的字符来替换双引号。

例如，如果你的光标在字符串 "hello" 上，执行 cs"' 后，字符串会变成 'hello'。 
 */

let id = 0;
function workLoop(deadline) {
  let flag = false;
  while (!flag) {
    id++;
    console.log(`第19行:${id}`, deadline.timeRemaining());
    flag = deadline.timeRemaining() > 1;
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
