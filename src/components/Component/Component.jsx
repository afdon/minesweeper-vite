import { useState, useEffect, useMemo, useCallback } from 'react';
import Child from '../Child/Child.jsx';
import ButtonGroup from '../ButtonGroup/ButtonGroup.jsx';
import {
  createBoard,
  getNeighborsIdx,
  fillMines,
  initialize,
} from './initialize.js';
// import { data } from '../data.js';
import './Component.css';

const Component = () => {
  let [rows, setRows] = useState(8);
  let [cols, setCols] = useState(12);
  let [mines, setMines] = useState(20);
  let [mineIndices, setMineIndices] = useState([]);
  let [values, setValues] = useState([]);
  // let data = Array.from(Array(rows * cols).keys());

  let [cellValues, setCellValues] = useState(values);
  let [cellView, setCellView] = useState(
    values.map(() => ({
      revealed: false,
      flagged: false,
    }))
  );

  useEffect(() => {
    // setRows(8);
    // setCols(12);
    // setMines(20);
    const emptyBoard = createBoard(rows, cols);
    const initialMineIndices = generateMineIndices(rows, cols, mines);
    setMineIndices(initialMineIndices);
    const board = fillMines(mineIndices, emptyBoard, rows, cols);

    setValues(board);

    setCellValues(board);
    setCellView(
      board.map(() => ({
        revealed: false,
        flagged: false,
      }))
    );
  }, [rows, cols, mines]);

  const handleCellView = (index, property) => {
    if (property === 'flaggedStatus') {
      setCellView((prev) => {
        const updatedCellView = [...prev];
        updatedCellView[index] = {
          ...updatedCellView[index],
          flagged: !updatedCellView[index].flagged,
        };
        return updatedCellView;
      });
    }

    if (property === 'revealedStatus') {
      if (!cellView[index].revealed) {
        setCellView((prev) => {
          const updatedCellView = [...prev];
          updatedCellView[index] = {
            ...updatedCellView[index],
            revealed: true,
          };

          // revealNeighbors();
          return updatedCellView;
        });
      }
      return;
    }
  };

  const handleChangeNum = (operation, whatToChange) => {
    let amount = 1;
    if (whatToChange === 'mines') {
      amount = 5;
    }
    if (operation === 'decrement') {
      amount = amount * -1;
    }

    if (whatToChange === 'rows') {
      setRows((prev) => {
        return prev + amount;
      });
    } else if (whatToChange === 'cols') {
      setCols((prev) => {
        return prev + amount;
      });
    } else {
      setMines((prev) => {
        return prev + amount;
      });
    }
  };
  const toggleRevealAll = () => {
    const revealedValues = cellView.map((cell) => cell.revealed);

    if (revealedValues.includes(false)) {
      setCellView((prevCellView) =>
        prevCellView.map((cell) => ({ ...cell, revealed: true }))
      );
    }
  };
  const sortDescending = (array) => {
    array.sort(function (a, b) {
      return b - a;
    });
  };
  const shuffle = () => {
    let shuffleddata = cellValues
      .map(function (n) {
        return [Math.random(), n];
      })
      .sort()
      .map(function (n) {
        return n[1];
      });

    setCellValues(shuffleddata);
  };

  const generateMineIndices = (rows, cols, mines) => {
    const totalCells = rows * cols;
    const allIndices = Array.from({ length: totalCells }, (_, index) => index);
    const shuffledIndices = shuffleArray(allIndices);
    return shuffledIndices.slice(0, mines);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // let board = createBoard(rows, cols);
  // board = fillMines(mineIndices, board, rows, cols, mines);

  // console.log('mineIndices', mineIndices);

  // const emptyBoard = createBoard(rows, cols);
  // const initialMineIndices = generateMineIndices(rows, cols, mines);
  // setMineIndices(initialMineIndices);
  // const board = fillMines(initialMineIndices, emptyBoard, rows, cols);

  // setValues(board);

  // setCellValues(board);
  // setCellView(
  //   board.map(() => ({
  //     revealed: false,
  //     flagged: false,
  //   }))
  // );

  return (
    <>
      <div>
        {/* <p>cellsRevealed: {cellsRevealed}</p> */}
        {/* <p className="long">mineIndices: {mineIndices}</p> */}
        {/* <p className="long">values: {cellValues}</p> */}
        {/* <p className="long">board: {board.length}</p> */}
      </div>
      <div>
        <ButtonGroup
          rows={rows}
          cols={cols}
          mines={mines}
          onClick={(operation, whatToChange) =>
            handleChangeNum(operation, whatToChange)
          }
        />
      </div>
      <div
        style={{
          display: 'grid',
          width: '80vw',
          height: 'auto',
          gridTemplateRows: `repeat(${rows},
          calc(80vmin / ${Math.max(rows, cols)}))`,
          gridTemplateColumns: `repeat(${cols},
          calc(80vmin / ${Math.max(cols)}))`,
          // gap: '2px',
          overflow: 'hidden',
          placeItems: 'center',
          justifyContent: 'center',
          margin: 'auto',
          // border: '1px solid black',
        }}
      >
        {values.map((element, index) => (
          <Child
            key={index}
            data={element}
            cellView={cellView[index]}
            onClick={() => handleCellView(index, 'revealedStatus')}
            onContextMenu={() => handleCellView(index, 'flaggedStatus')}
          />
        ))}
      </div>

      <div>
        <button onClick={() => toggleRevealAll()}>Reveal All</button>
        {/* <button onClick={() => shuffle()}>Shuffle</button> */}
      </div>
    </>
  );
};

export default Component;
