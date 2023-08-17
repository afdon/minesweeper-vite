import { useMemo } from 'react';
import { createBoard, generateMineIndices } from './functions.js';
import { fillMines } from './script.js';

export default function Board({ settings, revealedCells, flaggedCells, onCellClick, onFlagToggle }) {

    const board = createBoard(settings.numRows, settings.numCols);
    const minesIdx = generateMineIndices(
      settings.numMines,
      settings.numRows,
      settings.numCols
    );
    const filledBoard = fillMines(minesIdx, board, settings);
    const display = filledBoard.map((e) => getDisplayValue(e));
  
    return (
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
            isFlagged={flaggedCells[index]}
            cellValue={element}
            onClick={() => onCellClick(index)}
            onContextMenu={(event) => onFlagToggle(event, index)}
          />
        ))}
      </div>
    );
  }
  
  const GameCell = useMemo((props) => {
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
        {!props.isRevealed && props.isFlagged && '🚩'}
      </div>
    );
  });
  