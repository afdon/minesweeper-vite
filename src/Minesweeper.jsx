"use client";

import { useState } from "react";
import {
  // SETTINGS as settings,
  // start,
  findConnectedCellsToReveal,
  getDisplayValues,
  initialize,
} from "./setup.js";
import "./Minesweeper.css";
// import "./styles.module.css";

//////////

let board = initialize();

let display = getDisplayValues(board);

// const getDisplayValue = (element) => {
//     if (element === 0) { return "" }
//     if (element >= 10) { return "💣" }
//     if (element > 0 && element < 10) { return element }
//     if (element < 0) { return " " }
// };

//////////

export default function Game() {
  let [settings, setSettings] = useState({
    numMines: 25,
    numRows: 16,
    numCols: 30,
  }); // changed

  const [revealedCells, setRevealedCells] = useState(
    new Array(settings.numRows * settings.numCols).fill(false)
  );

  const [gameState, setGameState] = useState("playing");

  const [flagged, setFlagged] = useState(
    new Array(settings.numMines).fill(false)
  );

  const toggleFlag = (element, index) => {
    element.preventDefault();

    if (revealedCells[index]) return;

    let flaggedCopy = [...flagged];
    flaggedCopy[index] = !flaggedCopy[index];
    setFlagged(flaggedCopy);

    checkWin();
  };

  const handleIncrement = (property) => {
    let increment = 1;
    if (property === "numMines") {
      increment = 5;
    }

    setSettings((prevSettings) => ({
      ...prevSettings,
      [property]: prevSettings[property] + increment,
    }));
  };

  const handleDecrement = (property) => {
    let increment = 1;
    if (property === "numMines") {
      increment = 5;
    }
    setSettings((prevSettings) => ({
      ...prevSettings,
      [property]: prevSettings[property] - increment,
    }));
  };

  const handleCellClick = (index) => {
    // console.log(revealedCells[index], index);

    let newRevCells;

    if (board[index] >= 10) {
      setGameState("lost");
      newRevCells = new Array(settings.numRows * settings.numCols).fill(true);
    } else {
      newRevCells = [...revealedCells];
      const cellsToReveal = findConnectedCellsToReveal(index, board);
      cellsToReveal.forEach((c) => {
        newRevCells[c] = true;
      });
      newRevCells[index] = true;
    }

    setRevealedCells(newRevCells);
  };

  // const total = settings.numRows * settings.numCols;

  const getTotal = (settings) => {
    return settings.numRows * settings.numCols;
  }

  let numRevealed = revealedCells.filter((cell) => cell === true).length;
  let numFlagged = flagged.filter((cell) => cell === true).length;

  let checkWin = () => {
    console.log("numRevealed", numRevealed);
    console.log("numFlagged", numFlagged);

    let total = getTotal(settings)

    if (numRevealed + numFlagged >= total) {
      setGameState("won");
    }
  };

  return (
    <>
      {gameState === "lost" && <p>You lost!</p>}
      {gameState === "won" && <p>You won!</p>}

      <div>Mines Left: {settings.numMines - numFlagged}</div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: '4', 'justifyContent': 'center', margin: '5px' }} >
        <div>
          <button
            property="numMines"
            onClick={() => handleDecrement("numMines")}
          >
            -
          </button>
          <span style={{ display: "inline", margin: "5px", color: "white" }}>
            {settings.numMines}
          </span>
          <button
            property="numMines"
            onClick={() => handleIncrement("numMines")}
          >
            +
          </button>
        </div>

        <div>
          <button
            property="numRows"
            onClick={() => handleDecrement("numRows")}
          >
            -
          </button>
          <span style={{ display: "inline", margin: "5px", color: "white" }}>
            {settings.numRows}
          </span>
          <button
            property="numRows"
            onClick={() => handleIncrement("numRows")}
          >
            +
          </button>
        </div>

        <div>
          <button
            property="numCols"
            onClick={() => handleDecrement("numCols")}
          >
            -
          </button>
          <span style={{ display: "inline", margin: "5px", color: "white" }}>
            {settings.numCols}
          </span>
          <button
            property="numCols"
            onClick={() => handleIncrement("numCols")}
          >
            +
          </button>
        </div>
      </div>

      <div
        className="board"
        style={{
          display: "grid",
          width: "100vh",
          height: "auto",
          gridTemplateRows: `repeat(${settings.numRows},
            calc(100vmin / ${Math.max(settings.numRows, settings.numCols)}))`,
          gridTemplateColumns: `repeat(${settings.numCols},
            calc(100vmin / ${Math.max(settings.numRows, settings.numCols)}))`,
          overflow: "hidden",
          margin: "auto",
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

const GameCell = (props) => {
  let cn = "cell";

  if (props.isRevealed) {
    cn += " revealed";
  } else {
    cn += " notrevealed";
  }

  if (props.isFlagged) {
    cn += " flagged";
  } else {
    cn += " notflagged";
  }

  return (
    <div
      key={props.index}
      className={cn}
      onClick={props.onClick}
      onContextMenu={props.onContextMenu}
    >
      {props.isRevealed && props.cellValue}
      {!props.isRevealed && props.isFlagged && "🚩"}
      {/* {props.isRevealed && `${getDisplayValue(props.cellValue)}`} */}
    </div>
  );
};
