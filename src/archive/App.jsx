import { useState, useEffect, useMemo } from 'react';
import { createBoard, generateMineIndices } from './functions.js';
import { fillMines, getNeighborsIdx, incrementNeighbors } from './script.js';
import './App.css';

function App() {
  const [settings, setSettings] = useState({
    numMines: 25,
    numRows: 16,
    numCols: 20,
  });

  const [revealedCells, setRevealedCells] = useState(
    new Array(settings.numRows * settings.numCols).fill(false)
  );

  const [gameState, setGameState] = useState('playing');

  const [flagged, setFlagged] = useState(
    new Array(settings.numMines).fill(false)
  );

  useEffect(() => {
    console.log(settings);
  }, [settings]);

  let total = settings.numRows * settings.numCols;

  const toggleFlag = (element, index) => {
    element.preventDefault();

    if (revealedCells[index]) return;

    let flaggedCopy = [...flagged];
    flaggedCopy[index] = !flaggedCopy[index];
    setFlagged(flaggedCopy);

    checkWin();
  };

  const handleChangeSettings = (operation, property) => {
    let increment = 1;
    if (property === 'numMines') {
      increment = 5;
    }

    if (operation === 'remove') {
      increment = increment * -1;
    }

    setSettings((prevSettings) => ({
      ...prevSettings,
      [property]: prevSettings[property] + increment,
    }));
  };

  let numRevealed = revealedCells.filter((cell) => cell === true).length;
  let numFlagged = flagged.filter((cell) => cell === true).length;

  let checkWin = () => {
    console.log('numRevealed', numRevealed);
    console.log('numFlagged', numFlagged);

    if (numRevealed + numFlagged >= total) {
      setGameState('won');
    }
  };

  const getDisplayValue = (element) => {
    if (element === 0) return '';
    if (element >= 10) return '💣';
    if (element > 0 && element < 10) return element;
    return element; // if none of the conditions match
  };

  ////

  const handleCellClick = (index) => {
    // console.log(revealedCells[index], index);

    let newRevCells;

    if (board[index] >= 10) {
      setGameState('lost');
      newRevCells = new Array(settings.numRows * settings.numCols).fill(true);
    } else {
      newRevCells = [...revealedCells];
      const cellsToReveal = findConnectedCellsToReveal(index, board, settings);
      cellsToReveal.forEach((c) => {
        newRevCells[c] = true;
      });
      newRevCells[index] = true;
    }

    setRevealedCells(newRevCells);
  };

  // const findConnectedCellsToReveal = (index, board, settings) => {
  //   let queue = [index];
  //   let visited = [];
  //   let cellsToReveal = [];

  //   let counter = 0;

  //   while (queue.length > 0 && counter < settings.numRows * settings.numCols) {
  //     counter++;
  //     let curCell = queue.shift();

  //     if (board[curCell] === 0) {
  //       let neighbors = getNeighborsIdx(
  //         curCell,
  //         settings.numRows,
  //         settings.numCols
  //       ).slice(0, 4);
  //       neighbors.forEach((n) => {
  //         cellsToReveal.push(n);

  //         if (n !== null && !visited.includes(n) && board[n] === 0) {
  //           visited.push(n);
  //           queue.push(n);
  //         }
  //       });
  //     }
  //   }

  //   return cellsToReveal;
  // };

  const findConnectedCellsToReveal = (index, board, settings) => {
    let queue = [index];
    let visited = [];
    let cellsToReveal = [];

    while (
      queue.length > 0 &&
      cellsToReveal.length < settings.numRows * settings.numCols
    ) {
      let curCell = queue.shift();
      visited.push(curCell); // Mark current cell as visited

      if (board[curCell] === 0) {
        let neighbors = getNeighborsIdx(
          curCell,
          settings.numRows,
          settings.numCols
        ).slice(0, 4);
        neighbors.forEach((n) => {
          if (n !== null && !visited.includes(n) && !queue.includes(n)) {
            queue.push(n); // Add valid neighbors to queue
          }
        });
      }

      cellsToReveal.push(curCell); // Add the current cell to cells to reveal
    }

    return cellsToReveal;
  };

  ////

  let display = useMemo(() => {
    let board = createBoard(settings.numRows, settings.numCols);
    let minesIdx = generateMineIndices(
      settings.numMines,
      settings.numRows,
      settings.numCols
    );

    board = fillMines(minesIdx, board, settings);

    let display = board.map((e) => getDisplayValue(e));

    return display;
  }, [settings, gameState]);

  return (
    <>
      <h1>Vitesweeper</h1>
      {/* <div>board: {board}</div> */}
      {/* <div>display: {display}</div> */}
      {/* <div>minesIdx: {minesIdx}</div> */}
      <div className="buttons">
        <div>
          <button
            property="numMines"
            onClick={() => handleChangeSettings('remove', 'numMines')}
          >
            -
          </button>
          <span>{settings.numMines} 💣</span>
          <button
            property="numMines"
            onClick={() => handleChangeSettings('add', 'numMines')}
          >
            +
          </button>
        </div>

        <div>
          <button
            property="numRows"
            onClick={() => handleChangeSettings('remove', 'numRows')}
          >
            -
          </button>
          <span>{settings.numRows} R</span>
          <button
            property="numRows"
            onClick={() => handleChangeSettings('add', 'numRows')}
          >
            +
          </button>
        </div>

        <div>
          <button
            property="numCols"
            onClick={() => handleChangeSettings('remove', 'numCols')}
          >
            -
          </button>
          <span>{settings.numCols} C</span>
          <button
            property="numCols"
            onClick={() => handleChangeSettings('add', 'numCols')}
          >
            +
          </button>
        </div>
      </div>

      {/* <div>{board}</div> */}

      <div
        className="board"
        style={{
          display: 'grid',
          width: '100vh',
          height: 'auto',
          gridTemplateRows: `repeat(${settings.numRows},
            calc(100vmin / ${Math.max(settings.numRows, settings.numCols)}))`,
          gridTemplateColumns: `repeat(${settings.numCols},
            calc(100vmin / ${Math.max(settings.numRows, settings.numCols)}))`,
          overflow: 'hidden',
          margin: 'auto',
        }}
      >
        {display.map((element, index) => (
          <GameCell
            key={index}
            index={index}
            isRevealed={revealedCells[index]}
            isFlagged={flagged[index]}
            cellValue={element}
            onClick={() => handleCellClick(index)}
            onContextMenu={(event) => toggleFlag(event, index)}
          />
        ))}
      </div>
    </>
  );
}

export default App;

const GameCell = (props) => {
  let cn = 'cell';

  if (props.isRevealed) {
    cn += ' revealed';
  } else {
    cn += ' notrevealed';
  }

  if (props.isFlagged) {
    cn += ' flagged';
  } else {
    cn += ' notflagged';
  }

  return (
    <div
      key={props.index}
      className={cn}
      onClick={props.onClick}
      onContextMenu={props.onContextMenu}
    >
      {props.isRevealed && props.cellValue}
      {/* {!props.isRevealed && props.isFlagged && '🚩'} */}
      {props.cellValue}
    </div>
  );
};
