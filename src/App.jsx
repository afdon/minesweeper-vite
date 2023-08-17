import { useState } from 'react';
import Component from './components/Component/Component.jsx';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Simplesweeper</h1>
      <div className="card">
        {/* <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button> */}
      </div>
      <Component />
    </>
  );
}

export default App;
