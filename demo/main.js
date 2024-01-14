const tips = `
requestIdleCallback 是一个 JavaScript API，
它可以让你在浏览器的空闲时段内执行后台或低优先级的任务。
这个 API 可以帮助你的应用更有效地利用 CPU，提高性能。
当浏览器完成高优先级的任务（如动画和输入响应）后，就会有一些空闲时间。
requestIdleCallback 可以在这些空闲时间内运行回调函数。
这是一个基本的使用示例：
在这个示例中，我们在空闲时间内执行任务，直到时间用完或者所有任务都完成为止。如果还有未完成的任务，我们再次调用 requestIdleCallback 来在下一个空闲时段内继续执行。
`;

requestIdleCallback((deadline) => {
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    performTask(tasks.pop());
  }

  if (tasks.length > 0) {
    requestIdleCallback(deadline);
  }
});

const timeRemainingTips = `

deadline.timeRemaining() 是一个方法，
它返回浏览器在当前帧中剩余的空闲时间，单位是毫秒。这个方法可以帮助你判断是否有足够的时间来执行更多的任务。

在 requestIdleCallback 的回调函数中，你会得到一个 deadline 对象，这个对象有两个属性：timeRemaining 和 didTimeout。timeRemaining 是一个方法，返回当前帧中剩余的空闲时间；didTimeout 是一个布尔值，如果在回调函数被调用时已经超过了你在 requestIdleCallback 中设置的超时时间，那么 didTimeout 就会是 true。
`;
