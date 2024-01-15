import React from "./core/React.js";

function Counter({ num }) {
  return <div>counter: {num}</div>;
}

function Counter2({ num }) {
  return <div>counter2: {num}</div>;
}

// function ContainerCounter() {
//   return <Counter />;
// }

const App = (
  <div id="App">
    <div>app</div>
    <div>happy-dom</div>
    <Counter num={20} />
    <Counter2 num={30} />
    {/* <ContainerCounter /> */}
  </div>
);
export default App;
