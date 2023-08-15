import { useState } from 'react';
import Minesweeper from './Minesweeper.jsx';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Minesweeper</h1>

      <Minesweeper />

      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
    </>
  )
}

export default App
